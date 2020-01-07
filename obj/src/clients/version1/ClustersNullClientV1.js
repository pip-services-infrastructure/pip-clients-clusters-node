"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
class ClustersNullClientV1 {
    getClusters(correlationId, filter, paging, callback) {
        callback(null, new pip_services3_commons_node_1.DataPage([], 0));
    }
    getClusterById(correlationId, clusterId, callback) {
        callback(null, null);
    }
    getClusterByTenant(correlationId, tenant_id, callback) {
        callback(null, null);
    }
    createCluster(correlationId, cluster, callback) {
        callback(null, cluster);
    }
    updateCluster(correlationId, cluster, callback) {
        callback(null, cluster);
    }
    deleteClusterById(correlationId, clusterId, callback) {
        if (callback)
            callback(null, null);
    }
    addTenant(correlationId, tenantId, callback) {
        callback(null, null);
    }
    removeTenant(correlationId, tenantId, callback) {
        callback(null, null);
    }
}
exports.ClustersNullClientV1 = ClustersNullClientV1;
//# sourceMappingURL=ClustersNullClientV1.js.map