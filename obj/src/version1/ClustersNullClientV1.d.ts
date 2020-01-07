import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IClustersClientV1 } from './IClustersClientV1';
import { ClusterV1 } from './ClusterV1';
export declare class ClustersNullClientV1 implements IClustersClientV1 {
    getClusters(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ClusterV1>) => void): void;
    getClusterById(correlationId: string, clusterId: string, callback: (err: any, cluster: ClusterV1) => void): void;
    getClusterByTenant(correlationId: string, tenant_id: string, callback: (err: any, cluster: ClusterV1) => void): void;
    createCluster(correlationId: string, cluster: ClusterV1, callback: (err: any, cluster: ClusterV1) => void): void;
    updateCluster(correlationId: string, cluster: ClusterV1, callback: (err: any, cluster: ClusterV1) => void): void;
    deleteClusterById(correlationId: string, clusterId: string, callback: (err: any, cluster: ClusterV1) => void): void;
    addTenant(correlationId: string, tenantId: string, callback: (err: any, cluster: ClusterV1) => void): void;
    removeTenant(correlationId: string, tenantId: string, callback: (err: any, cluster: ClusterV1) => void): void;
}
