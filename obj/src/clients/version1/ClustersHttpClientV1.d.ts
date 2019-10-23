import { FilterParams } from 'pip-services-commons-node';
import { PagingParams } from 'pip-services-commons-node';
import { DataPage } from 'pip-services-commons-node';
import { CommandableHttpClient } from 'pip-services-rpc-node';
import { ClusterV1 } from '../../data/version1/ClusterV1';
import { IClustersClientV1 } from './IClustersClientV1';
export declare class ClustersHttpClientV1 extends CommandableHttpClient implements IClustersClientV1 {
    constructor(config?: any);
    getClusters(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<ClusterV1>) => void): void;
    getClusterById(correlationId: string, clusterId: string, callback: (err: any, cluster: ClusterV1) => void): void;
    getClusterByTenant(correlationId: string, tenantId: string, callback: (err: any, cluster: ClusterV1) => void): void;
    createCluster(correlationId: string, cluster: ClusterV1, callback: (err: any, cluster: ClusterV1) => void): void;
    updateCluster(correlationId: string, cluster: ClusterV1, callback: (err: any, cluster: ClusterV1) => void): void;
    deleteClusterById(correlationId: string, clusterId: string, callback: (err: any, cluster: ClusterV1) => void): void;
    addTenant(correlationId: string, tenantId: string, callback: (err: any, cluster: ClusterV1) => void): void;
    removeTenant(correlationId: string, tenantId: string, callback: (err: any, cluster: ClusterV1) => void): void;
}
