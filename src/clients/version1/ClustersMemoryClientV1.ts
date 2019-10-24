let _ = require('lodash');

import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams} from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { IdGenerator } from 'pip-services-commons-node';
import { DirectClient } from 'pip-services-rpc-node';

import { IClustersClientV1 } from './IClustersClientV1';
import { ClusterV1 } from '../../data/version1/ClusterV1';

export class ClustersMemoryClientV1 implements IClustersClientV1 {
    private _clusters: ClusterV1[] = [];
            
    private matchString(value: string, search: string): boolean {
        if (value == null && search == null)
            return true;
        if (value == null || search == null)
            return false;
        return value.toLowerCase().indexOf(search) >= 0;
    }

    private matchSearch(item: ClusterV1, search: string): boolean {
        search = search.toLowerCase();
        if (this.matchString(item.id, search))
            return true;
        if (this.matchString(item.name, search))
            return true;
        return false;
    }

    private contains(array1, array2) {
        if (array1 == null || array2 == null) return false;
        
        for (let i1 = 0; i1 < array1.length; i1++) {
            for (let i2 = 0; i2 < array2.length; i2++)
                if (array1[i1] == array2[i1]) 
                    return true;
        }
        
        return false;
    }
    
    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();
        
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

    public getClusters(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ClusterV1>) => void): void {
        
        let clusters = _.filter(this._clusters, this.composeFilter(filter));
        callback(null, new DataPage<ClusterV1>(clusters, clusters.length));
    }

    public getClusterById(correlationId: string, clusterId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {

        let cluster = _.find(this._clusters, (d) => d.id == clusterId);
        callback(null, cluster);
    }

    public getClusterByTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {

        let cluster = _.find(this._clusters, (d) => d.active && _.indexOf(d.active_tenants, tenantId) >= 0);
        callback(null, cluster);
    }

    public createCluster(correlationId: string, cluster: ClusterV1, 
        callback: (err: any, cluster: ClusterV1) => void): void {

        cluster.id = cluster.id || IdGenerator.nextLong();
        cluster.update_time = cluster.update_time || new Date();
        cluster.active = cluster.active != null || true;
        cluster.open = cluster.max_tenant_count > cluster.tenants_count;

        this._clusters.push(cluster);
        callback(null, cluster);
    }

    public updateCluster(correlationId: string, cluster: ClusterV1, 
        callback: (err: any, cluster: ClusterV1) => void): void {

        cluster.open = cluster.max_tenant_count > cluster.tenants_count;

        this._clusters = _.filter(this._clusters, (d) => d.id != cluster.id);
        this._clusters.push(cluster);
        
        callback(null, cluster);
    }

    public deleteClusterById(correlationId: string, clusterId: string,
        callback: (err: any, cluster: ClusterV1) => void): void {

        let cluster = _.find(this._clusters, (d) => d.id == clusterId);
        this._clusters = _.filter(this._clusters, (d) => d.id != clusterId);
        
        callback(null, cluster);
    }

    public addTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {

        let cluster = _.find(this._clusters, c => c.active && c.open);
        if (cluster) {
            cluster.active_tenants = cluster.active_tenants || [];
            cluster.active_tenants.push(tenantId);
            cluster.tenants_count++;
            cluster.open = cluster.max_tenant_count > cluster.tenants_count;
        }

        callback(null, cluster);
    }

    public removeTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {

        let cluster = _.find(this._clusters, c => _.indexOf(c.active_tenants, tenantId) >= 0);
        if (cluster) {
            cluster.active_tenants = _.filter(cluster.active_tenants, s => s != tenantId);
            cluster.tenants_count--;
            cluster.open = cluster.max_tenant_count > cluster.tenants_count;
        }

        callback(null, cluster);
    }

}