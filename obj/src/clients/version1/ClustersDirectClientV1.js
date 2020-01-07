"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class ClustersDirectClientV1 extends pip_services3_rpc_node_1.DirectClient {
    constructor() {
        super();
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor("pip-services-clusters", "controller", "*", "*", "*"));
    }
    getClusters(correlationId, filter, paging, callback) {
        let timing = this.instrument(correlationId, 'clusters.get_clusters');
        this._controller.getClusters(correlationId, filter, paging, (err, page) => {
            timing.endTiming();
            callback(err, page);
        });
    }
    getClusterById(correlationId, clusterId, callback) {
        let timing = this.instrument(correlationId, 'clusters.get_cluster_by_id');
        this._controller.getClusterById(correlationId, clusterId, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }
    getClusterByTenant(correlationId, tenantId, callback) {
        let filter = pip_services3_commons_node_2.FilterParams.fromTuples('active', true, 'tenant_id', tenantId);
        this.getClusters(correlationId, filter, null, (err, page) => {
            if (page && page.data && page.data.length > 0)
                callback(err, page.data[0]);
            else
                callback(err, null);
        });
    }
    createCluster(correlationId, cluster, callback) {
        let timing = this.instrument(correlationId, 'clusters.create_cluster');
        this._controller.createCluster(correlationId, cluster, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }
    updateCluster(correlationId, cluster, callback) {
        let timing = this.instrument(correlationId, 'clusters.update_cluster');
        this._controller.updateCluster(correlationId, cluster, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }
    deleteClusterById(correlationId, clusterId, callback) {
        let timing = this.instrument(correlationId, 'clusters.delete_cluster_by_id');
        this._controller.deleteClusterById(correlationId, clusterId, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }
    addTenant(correlationId, tenantId, callback) {
        let timing = this.instrument(correlationId, 'clusters.add_tenant');
        this._controller.addTenant(correlationId, tenantId, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }
    removeTenant(correlationId, tenantId, callback) {
        let timing = this.instrument(correlationId, 'clusters.remove_tenant');
        this._controller.removeTenant(correlationId, tenantId, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }
}
exports.ClustersDirectClientV1 = ClustersDirectClientV1;
//# sourceMappingURL=ClustersDirectClientV1.js.map