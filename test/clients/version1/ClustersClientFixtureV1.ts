let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { PagingParams } from 'pip-services-commons-node';

import { ClusterV1 } from '../../../src/data/version1/ClusterV1';
import { IClustersClientV1 } from '../../../src/clients/version1/IClustersClientV1';

let CLUSTER1: ClusterV1 = {
    id: '1',
    name: 'Cluster #1',
    type: 'root',
    active: true,
    api_host: 'api.mycluster1.com',
    service_ports: { myservice1: 30001, myservice2: 30002 },
    max_tenant_count: 1,
    tenants_count: 1,
    active_tenants: ['1']
};
let CLUSTER2: ClusterV1 = {
    id: '2',
    name: 'Cluster #2',
    type: 'tenants',
    active: true,
    api_host: 'api.mycluster2.com',
    service_ports: { myservice1: 30001, myservice2: 30002 },
    max_tenant_count: 10,
    tenants_count: 4,
    active_tenants: ['2', '3'],
    inactive_tenants: ['4']
};

export class ClustersClientFixtureV1 {
    private _client: IClustersClientV1;
    
    constructor(client: IClustersClientV1) {
        this._client = client;
    }
        
    public testCrudOperations(done) {
        let cluster1, cluster2: ClusterV1;

        async.series([
        // Create one cluster
            (callback) => {
                this._client.createCluster(
                    null,
                    CLUSTER1,
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.equal(cluster.name, CLUSTER1.name);
                        assert.equal(cluster.api_host, CLUSTER1.api_host);

                        cluster1 = cluster;

                        callback();
                    }
                );
            },
        // Create another cluster
            (callback) => {
                this._client.createCluster(
                    null,
                    CLUSTER2,
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.equal(cluster.name, CLUSTER2.name);
                        assert.equal(cluster.api_host, CLUSTER2.api_host);

                        cluster2 = cluster;

                        callback();
                    }
                );
            },
        // Get all clusters
            (callback) => {
                this._client.getClusters(
                    null,
                    null,
                    new PagingParams(0,5,false),
                    (err, clusters) => {
                        assert.isNull(err);

                        assert.isObject(clusters);
                        assert.isTrue(clusters.data.length >= 2);

                        callback();
                    }
                );
            },
        // Update the cluster
            (callback) => {
                cluster1.active = false;
                cluster1.max_tenant_count = 2;
                cluster1.tenants_count = 2;

                this._client.updateCluster(
                    null,
                    cluster1,
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.isFalse(cluster.active);
                        assert.equal(cluster.max_tenant_count, 2);
                        assert.equal(cluster.tenants_count, 2);
                        assert.isFalse(cluster.open);

                        cluster1 = cluster;

                        callback();
                    }
                );
            },
            // Add tenant to cluster
            (callback) => {
                this._client.addTenant(
                    null,
                    '5',
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.isTrue(cluster.active);                        

                        assert.isTrue(_.indexOf(cluster.active_tenants, '5') >= 0);

                        callback();
                    }
                );
            },
            // Get cluster by tenant
            (callback) => {
                this._client.getClusterByTenant(
                    null,
                    '5',
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.isTrue(cluster.active);                        

                        assert.isTrue(_.indexOf(cluster.active_tenants, '5') >= 0);

                        callback();
                    }
                );
            },
            // Remove tenant from cluster
            (callback) => {
                this._client.removeTenant(
                    null,
                    '5',
                    (err, cluster) => {
                        assert.isNull(err);

                        assert.isObject(cluster);
                        assert.isTrue(_.indexOf(cluster.active_tenants, '5') < 0);

                        callback();
                    }
                );
            },
            // Delete cluster
            (callback) => {
                this._client.deleteClusterById(
                    null,
                    cluster1.id,
                    (err) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete cluster
            (callback) => {
                this._client.getClusterById(
                    null,
                    cluster1.id,
                    (err, cluster) => {
                        assert.isNull(err);
                        
                        assert.isNull(cluster || null);

                        callback();
                    }
                );
            }
        ], done);
    }
}
