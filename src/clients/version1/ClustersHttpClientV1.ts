import { ConfigParams } from 'pip-services-commons-node';
import { IReferences } from 'pip-services-commons-node';
import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { CommandableHttpClient } from 'pip-services-rpc-node';

import { ClusterV1 } from '../../data/version1/ClusterV1';
import { IClustersClientV1 } from './IClustersClientV1';

export class ClustersHttpClientV1 extends CommandableHttpClient implements IClustersClientV1 {       
    
    constructor(config?: any) {
        super('v1/clusters');

        if (config != null)
            this.configure(ConfigParams.fromValue(config));
    }
                
    public getClusters(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<ClusterV1>) => void): void {
        this.callCommand( 
            'get_clusters', 
            correlationId,
            {
                filter: filter,
                paging: paging
            }, 
            callback
        );
    }

    public getClusterById(correlationId: string, clusterId: string,
        callback: (err: any, cluster: ClusterV1) => void): void {
        this.callCommand( 
            'get_cluster_by_id',
            correlationId,
            {
                cluster_id: clusterId
            }, 
            callback
        );        
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
        this.callCommand(
            'create_cluster',
            correlationId,
            {
                cluster: cluster
            }, 
            callback
        );
    }

    public updateCluster(correlationId: string, cluster: ClusterV1,
        callback: (err: any, cluster: ClusterV1) => void): void {
        this.callCommand(
            'update_cluster', 
            correlationId,
            {
                cluster: cluster
            }, 
            callback
        );
    }

    public deleteClusterById(correlationId: string, clusterId: string,
        callback: (err: any, cluster: ClusterV1) => void): void {
        this.callCommand(
            'delete_cluster_by_id', 
            correlationId,
            {
                cluster_id: clusterId
            }, 
            callback
        );
    }
    
    public addTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        this.callCommand(
            'add_tenant', 
            correlationId,
            {
                tenant_id: tenantId
            }, 
            callback
        );
    }

    public removeTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        this.callCommand(
            'remove_tenant', 
            correlationId,
            {
                tenant_id: tenantId
            }, 
            callback
        );
    }

}
