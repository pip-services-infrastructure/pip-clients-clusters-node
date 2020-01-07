"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async = require('async');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
class ClustersProxyHttpClientV1 {
    constructor(factory, serviceName, defaultPort) {
        this._cacheTimeout = 900000;
        this._clientTimeout = 300000;
        this._defaultProtocol = 'http';
        this._cache = {};
        this._factory = factory;
        this._serviceName = serviceName;
        this._defaultPort = defaultPort;
    }
    configure(config) {
        this._config = config;
        this._serviceName = config.getAsStringWithDefault('service_name', this._serviceName);
        this._cacheTimeout = config.getAsLongWithDefault('options.cache_timeout', this._cacheTimeout);
        this._clientTimeout = config.getAsLongWithDefault('options.client_timeout', this._clientTimeout);
        this._defaultProtocol = config.getAsStringWithDefault('connection.protocol', this._defaultProtocol);
        this._defaultPort = config.getAsLongWithDefault('connection.port', this._defaultPort);
    }
    setReferences(references) {
        this._references = references;
        this._clustersClient = references.getOneRequired(new pip_services3_commons_node_2.Descriptor('pip-services-clusters', 'client', '*', '*', '1.0'));
    }
    close(correlationId, callback) {
        this._cache = {};
        if (callback)
            callback(null);
    }
    clearCache(force = false) {
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
    getClient(correlationId, tenantId, callback) {
        // Check tenant id
        if (tenantId == null) {
            let err = new pip_services3_commons_node_4.InternalException(correlationId, 'NO_TENANT_ID', 'Tenant ID is not specified');
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
            let err = new pip_services3_commons_node_3.ReferenceException(correlationId, 'pip-services-clusters:client:*:*:1.0');
            callback(err, null);
            return;
        }
        let cluster = null;
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
                    let err = new pip_services3_commons_node_4.InternalException(correlationId, 'TENANT_CLUSTER_NOT_FOUND', 'Tenant cluster was not found');
                    callback(err);
                    return;
                }
                if (!cluster.active) {
                    let err = new pip_services3_commons_node_4.InternalException(correlationId, 'CLUSTER_INACTIVE', 'Tenant cluster is not active');
                    callback(err);
                    return;
                }
                if (cluster.maintenance) {
                    let err = new pip_services3_commons_node_4.InternalException(correlationId, 'MAINTENANCE', 'Tenant cluster is on maintenance');
                    callback(err);
                    return;
                }
                if (cluster.api_host == null || cluster.api_host == "") {
                    let err = new pip_services3_commons_node_4.InternalException(correlationId, 'NO_CLUSTER_API_HOST', 'API host is not set in tenant cluster');
                    callback(err);
                    return;
                }
                // Create and set reference
                cluster.service_ports = cluster.service_ports || {};
                ref = {
                    created: new Date().getTime(),
                    url: null,
                    protocol: this._defaultProtocol,
                    host: cluster.api_host,
                    port: cluster.service_ports[this._serviceName] || this._defaultPort
                };
                this._cache[tenantId] = ref;
                callback();
            },
            (callback) => {
                // Create client using factory
                let client = new this._factory();
                // Configure client
                let config = pip_services3_commons_node_1.ConfigParams.fromTuples('connection.url', ref.url, 'connection.protocol', ref.protocol, 'connection.host', ref.host, 'connection.port', ref.port);
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
exports.ClustersProxyHttpClientV1 = ClustersProxyHttpClientV1;
//# sourceMappingURL=ClustersProxyHttpClientV1.js.map