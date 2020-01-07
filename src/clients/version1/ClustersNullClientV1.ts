import { IReferences } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams} from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { IClustersClientV1 } from './IClustersClientV1';
import { ClusterV1 } from '../../data/version1/ClusterV1';

export class ClustersNullClientV1 implements IClustersClientV1 {
            
    public getClusters(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ClusterV1>) => void): void {
        callback(null, new DataPage<ClusterV1>([], 0));
    }

    public getClusterById(correlationId: string, clusterId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        callback(null, null);
    }

    public getClusterByTenant(correlationId: string, tenant_id: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        callback(null, null);
    }

    public createCluster(correlationId: string, cluster: ClusterV1, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        callback(null, cluster);
    }

    public updateCluster(correlationId: string, cluster: ClusterV1, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        callback(null, cluster);
    }

    public deleteClusterById(correlationId: string, clusterId: string,
        callback: (err: any, cluster: ClusterV1) => void): void {
        if (callback) callback(null, null);
    }

    public addTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        callback(null, null);
    }

    public removeTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void): void {
        callback(null, null);
    }    
}