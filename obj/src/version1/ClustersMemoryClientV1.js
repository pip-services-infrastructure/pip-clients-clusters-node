"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services_commons_node_1 = require("pip-services-commons-node");
const pip_services_commons_node_2 = require("pip-services-commons-node");
const pip_services_commons_node_3 = require("pip-services-commons-node");
class ClustersMemoryClientV1 {
    constructor() {
        this._clusters = [];
    }
    matchString(value, search) {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }
    matchSearch(item, search) {
        search = search.toLowerCase();
        if (this.matchString(item.id, search))
            return true;
        if (this.matchString(item.name, search))
            return true;
        return false;
    }
    contains(array1, array2) {
        if (array1 == null || array2 == null)
            return false;
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1])
                    return true;
        }
        return false;
    }
    composeFilter(filter) {
        filter = filter || new pip_services_commons_node_1.FilterParams();
        let search = filter.getAsNullableString('search');
        let id = filter.getAsNullableString('id');
        let name = filter.getAsNullableString('name');
        let type = filter.getAsNullableString('type');
        let active = filter.getAsNullableBoolean('active');
        let open = filter.getAsNullableBoolean('open');
        let tenantId = filter.getAsNullableString('tenant_id');
        let tenantIds = filter.getAsObject('tenant_ids');
        // Process ids filter
        if (_.isString(tenantIds))
            tenantIds = tenantIds.split(',');
        if (!_.isArray(tenantIds))
            tenantIds = null;
        return (item) => {
            if (id && item.id != id)
                return false;
            if (tenantId && _.indexOf(item.active_tenants, tenantId) < 0)
                return false;
            if (tenantIds && !this.contains(tenantIds, item.active_tenants))
                return false;
            if (name && item.name != name)
                return false;
            if (type && item.type != type)
                return false;
            if (active && item.active != active)
                return false;
            if (open && item.open != open)
                return false;
            if (search && !this.matchSearch(item, search))
                return false;
            return true;
        };
    }
    getClusters(correlationId, filter, paging, callback) {
        let clusters = _.filter(this._clusters, this.composeFilter(filter));
        callback(null, new pip_services_commons_node_2.DataPage(clusters, clusters.length));
    }
    getClusterById(correlationId, clusterId, callback) {
        let cluster = _.find(this._clusters, (d) => d.id == clusterId);
        callback(null, cluster);
    }
    getClusterByTenant(correlationId, tenantId, callback) {
        let cluster = _.find(this._clusters, (d) => d.active && _.indexOf(d.active_tenants, tenantId) >= 0);
        callback(null, cluster);
    }
    createCluster(correlationId, cluster, callback) {
        cluster.id = cluster.id || pip_services_commons_node_3.IdGenerator.nextLong();
        cluster.update_time = cluster.update_time || new Date();
        cluster.active = cluster.active != null || true;
        cluster.open = cluster.max_tenant_count > cluster.tenants_count;
        this._clusters.push(cluster);
        callback(null, cluster);
    }
    updateCluster(correlationId, cluster, callback) {
        cluster.open = cluster.max_tenant_count > cluster.tenants_count;
        this._clusters = _.filter(this._clusters, (d) => d.id != cluster.id);
        this._clusters.push(cluster);
        callback(null, cluster);
    }
    deleteClusterById(correlationId, clusterId, callback) {
        let cluster = _.find(this._clusters, (d) => d.id == clusterId);
        this._clusters = _.filter(this._clusters, (d) => d.id != clusterId);
        callback(null, cluster);
    }
    addTenant(correlationId, tenantId, callback) {
        let cluster = _.find(this._clusters, c => c.active && c.open);
        if (cluster) {
            cluster.active_tenants = cluster.active_tenants || [];
            cluster.active_tenants.push(tenantId);
            cluster.tenants_count++;
            cluster.open = cluster.max_tenant_count > cluster.tenants_count;
        }
        callback(null, cluster);
    }
    removeTenant(correlationId, tenantId, callback) {
        let cluster = _.find(this._clusters, c => _.indexOf(c.active_tenants, tenantId) >= 0);
        if (cluster) {
            cluster.active_tenants = _.filter(cluster.active_tenants, s => s != tenantId);
            cluster.tenants_count--;
            cluster.open = cluster.max_tenant_count > cluster.tenants_count;
        }
        callback(null, cluster);
    }
}
exports.ClustersMemoryClientV1 = ClustersMemoryClientV1;
//# sourceMappingURL=ClustersMemoryClientV1.js.map