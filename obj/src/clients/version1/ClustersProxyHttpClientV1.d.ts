import { ConfigParams } from 'pip-services3-commons-node';
import { IClosable } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
export declare class ClustersProxyHttpClientV1<T> implements IConfigurable, IReferenceable, IClosable {
    private _factory;
    private _serviceName;
    private _defaultPort;
    private _cacheTimeout;
    private _clientTimeout;
    private _defaultProtocol;
    private _cache;
    private _config;
    private _references;
    private _clustersClient;
    constructor(factory: any, serviceName: string, defaultPort: number);
    configure(config: ConfigParams): void;
    setReferences(references: IReferences): void;
    close(correlationId: string, callback?: (err: any) => void): void;
    protected clearCache(force?: boolean): void;
    protected getClient(correlationId: string, tenantId: string, callback: (err: any, client: T) => void): void;
}
