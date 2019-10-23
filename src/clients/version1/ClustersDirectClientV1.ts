import { IReferences } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams} from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { DirectClient } from 'pip-services-rpc-node';

import { IClustersClientV1 } from './IClustersClientV1';
//import { IClustersController } from 'pip-services-clusters-node';
import { ClusterV1 } from '../../data/version1/ClusterV1';

export class ClustersDirectClientV1 extends DirectClient<any> implements IClustersClientV1 {
            
    public constructor() {
        super();
        this._dependencyResolver.put('controller', new Descriptor("pip-services-clusters", "controller", "*", "*", "*"))
    }

    public getClusters(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ClusterV1>) => void): void {
        let timing = this.instrument(correlationId, 'clusters.get_clusters');
        this._controller.getClusters(correlationId, filter, paging, (err, page) => {
            timing.endTiming();
            callback(err, page);
        });
    }

    public getClusterById(correlationId: string, clusterId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        let timing = this.instrument(correlationId, 'clusters.get_cluster_by_id');
        this._controller.getClusterById(correlationId, clusterId, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }

    public getClusterByTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {

        let filter = FilterParams.fromTuples(
            'active', true,
            'tenant_id', tenantId
        );

        this.getClusters(correlationId, filter, null, (err, page) => {
            if (page && page.data && page.data.length > 0)
                callback(err, page.data[0]);
            else callback(err, null);
        });
    }

    public createCluster(correlationId: string, cluster: ClusterV1, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        let timing = this.instrument(correlationId, 'clusters.create_cluster');
        this._controller.createCluster(correlationId, cluster, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }

    public updateCluster(correlationId: string, cluster: ClusterV1, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        let timing = this.instrument(correlationId, 'clusters.update_cluster');
        this._controller.updateCluster(correlationId, cluster, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }

    public deleteClusterById(correlationId: string, clusterId: string,
        callback: (err: any, cluster: ClusterV1) => void): void {
        let timing = this.instrument(correlationId, 'clusters.delete_cluster_by_id');
        this._controller.deleteClusterById(correlationId, clusterId, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }

    public addTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        let timing = this.instrument(correlationId, 'clusters.add_tenant');
        this._controller.addTenant(correlationId, tenantId, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }

    public removeTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        let timing = this.instrument(correlationId, 'clusters.remove_tenant');
        this._controller.removeTenant(correlationId, tenantId, (err, cluster) => {
            timing.endTiming();
            callback(err, cluster);
        });
    }
    
}