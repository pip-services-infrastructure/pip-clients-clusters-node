"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services_commons_node_1 = require("pip-services3-commons-node");
const pip_services_commons_node_2 = require("pip-services3-commons-node");
const pip_services_aws_node_1 = require("pip-services-aws-node");
class ClustersLambdaClientV1 extends pip_services_aws_node_1.CommandableLambdaClient {
    constructor(config) {
        super('clusters');
        if (config != null)
            this.configure(pip_services_commons_node_1.ConfigParams.fromValue(config));
    }
    getClusters(correlationId, filter, paging, callback) {
        this.callCommand('get_clusters', correlationId, {
            filter: filter,
            paging: paging
        }, callback);
    }
    getClusterById(correlationId, clusterId, callback) {
        this.callCommand('get_cluster_by_id', correlationId, {
            cluster_id: clusterId
        }, callback);
    }
    getClusterByTenant(correlationId, tenantId, callback) {
        let filter = pip_services_commons_node_2.FilterParams.fromTuples('active', true, 'tenant_id', tenantId);
        this.getClusters(correlationId, filter, null, (err, page) => {
            if (page && page.data && page.data.length > 0)
                callback(err, page.data[0]);
            else
                callback(err, null);
        });
    }
    createCluster(correlationId, cluster, callback) {
        this.callCommand('create_cluster', correlationId, {
            cluster: cluster
        }, callback);
    }
    updateCluster(correlationId, cluster, callback) {
        this.callCommand('update_cluster', correlationId, {
            cluster: cluster
        }, callback);
    }
    deleteClusterById(correlationId, clusterId, callback) {
        this.callCommand('delete_cluster_by_id', correlationId, {
            cluster_id: clusterId
        }, callback);
    }
    addTenant(correlationId, tenantId, callback) {
        this.callCommand('add_tenant', correlationId, {
            tenant_id: tenantId
        }, callback);
    }
    removeTenant(correlationId, tenantId, callback) {
        this.callCommand('remove_tenant', correlationId, {
            tenant_id: tenantId
        }, callback);
    }
}
exports.ClustersLambdaClientV1 = ClustersLambdaClientV1;
//# sourceMappingURL=ClustersLambdaClientV1.js.map