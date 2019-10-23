const async = require('async');

import { ConfigParams } from 'pip-services-commons-node';
import { IClosable } from 'pip-services-commons-node';
import { IConfigurable } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { IReferenceable } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { ReferenceException } from 'pip-services-commons-node';
import { InternalException } from 'pip-services-commons-node';

import { ClusterV1 } from '../../data/version1/ClusterV1';
import { IClustersClientV1 } from './IClustersClientV1';
import { ProxyReference } from '../../refs/ProxyReference';

export class ClustersProxyHttpClientV1<T>
    implements IConfigurable, IReferenceable, IClosable { 

    private _factory: any;
    private _serviceName: string;
    private _defaultPort: number;
    private _cacheTimeout: number = 900000;
    private _clientTimeout: number = 300000;
    private _defaultProtocol: string = 'http';
    private _cache: { [tenantId: string]: ProxyReference<T> } = {};

    private _config: ConfigParams;
    private _references: IReferences;
    private _clustersClient: IClustersClientV1;

    constructor(factory: any, serviceName: string, defaultPort: number) {
        this._factory = factory;
        this._serviceName = serviceName;
        this._defaultPort = defaultPort;
    }

    public configure(config: ConfigParams): void {
        this._config = config;

        this._serviceName = config.getAsStringWithDefault('service_name', this._serviceName);
        this._cacheTimeout = config.getAsLongWithDefault('options.cache_timeout', this._cacheTimeout);
        this._clientTimeout = config.getAsLongWithDefault('options.client_timeout', this._clientTimeout);
        this._defaultProtocol = config.getAsStringWithDefault('connection.protocol', this._defaultProtocol);
        this._defaultPort = config.getAsLongWithDefault('connection.port', this._defaultPort);
    }
        
    public setReferences(references: IReferences): void {
        this._references = references;

        this._clustersClient = references.getOneRequired<IClustersClientV1>(
            new Descriptor('pip-services-clusters', 'client', '*', '*', '1.0'));
    }

    public close(correlationId: string, callback?: (err: any) => void): void {
        this._cache = {};
        if (callback) callback(null);
    }

    protected clearCache(force: boolean = false): void {
        let now = new Date().getTime();
        let cacheCutoffTime = now - this._cacheTimeout;
        let clientCutoffTime = now - this._clientTimeout;

        for (let tenantId in this._cache) {
            let ref = this._cache[tenantId];

            if (ref.connected < clientCutoffTime) {
                ref.client = null;
            }
            if (force || ref.created < cacheCutoffTime) {
                delete this._cache[tenantId];
            }
        }
    }

    protected getClient(correlationId: string, tenantId: string,
        callback: (err: any, client: T) => void): void {
        
        // Check tenant id
        if (tenantId == null) {
            let err = new InternalException(
                correlationId, 'NO_SITE_ID', 'Tenant ID is not specified'
            );
            callback(err, null);
            return;
        }

        // Clearn cached references
        this.clearCache();

        // Try to get client from cache
        let ref = this._cache[tenantId];
        if (ref != null && ref.client != null) {
            callback(null, ref.client);
            return;
        }

        // Check for clusters client
        if (this._clustersClient == null) {
            let err = new ReferenceException(
                correlationId, 'pip-services-clusters:client:*:*:1.0'
            );
            callback(err, null);
            return;
        }

        let cluster: ClusterV1 = null;

        async.series([
            // Retrieve configuration from cluster
            (callback) => {
                if (ref) {
                    callback();
                    return;
                }

                this._clustersClient.getClusterByTenant(correlationId, tenantId, (err, result) => {
                    cluster = result;
                    callback(err);
                });
            },
            // Check for cluster
            (callback) => {
                if (cluster == null) {
                    let err = new InternalException(
                        correlationId, 'SITE_CLUSTER_NOT_FOUND', 'Tenant cluster was not found'
                    );
                    callback(err);
                    return;
                }
                if (!cluster.active) {
                    let err = new InternalException(
                        correlationId, 'CLUSTER_INACTIVE', 'Tenant cluster is not active'
                    );
                    callback(err);
                    return;
                }
                if (cluster.maintenance) {
                    let err = new InternalException(
                        correlationId, 'MAINTENANCE', 'Tenant cluster is on maintenance'
                    );
                    callback(err);
                    return;
                }
                if (cluster.api_host == null || cluster.api_host == "") {
                    let err = new InternalException(
                        correlationId, 'NO_CLUSTER_API_HOST', 'API host is not set in tenant cluster'
                    );
                    callback(err);
                    return;
                }

                // Create and set reference
                cluster.service_ports = cluster.service_ports || {};
                ref = <ProxyReference<T>> {
                    created: new Date().getTime(),
                    url: null,
                    protocol: this._defaultProtocol,
                    host: cluster.api_host,
                    port: cluster.service_ports[this._serviceName] || this._defaultPort
                }
                this._cache[tenantId] = ref;

                callback();
            },
            (callback) => {
                // Create client using factory
                let client = new this._factory();

                // Configure client
                let config = ConfigParams.fromTuples(
                    'connection.url', ref.url,
                    'connection.protocol', ref.protocol,
                    'connection.host', ref.host,
                    'connection.port', ref.port
                );
                if (this._config)
                    config = config.setDefaults(this._config);
                if (client.configure)
                    client.configure(config);

                // Set references
                if (client.setReferences && this._references)
                    client.setReferences(this._references);

                // Open the client and store client reference
                if (client.open) {
                    client.open(correlationId, (err) => {
                        if (err == null) {
                            ref.connected = new Date().getTime();
                            ref.client = client;
                        }
                        callback(err);
                    });
                }
                // If client does not require opening 
                else {
                    ref.connected = new Date().getTime();
                    ref.client = client;
                    callback(null);
                }
            }
        ], (err) => {
            callback(err, ref ? ref.client : null);
        });
    }
    
}
