# <img src="https://github.com/pip-services/pip-services/raw/master/design/Logo.png" alt="Pip.Services Logo" style="max-width:30%"> <br/> Clusters Microservice Client SDK for Node.js

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* Service
  - [Clusters service](https://github.com/pip-services-infrastructure/pip-service-clusters-node)

This is a Node.js client SDK for [pip-services-clusters](https://github.com/pip-services-infrastructure/pip-services-clusters-node) microservice.

 It provides an easy to use abstraction over communication protocols:

- Direct client for monolythic deployments
- Http client
- Lambda client for AWS
- Memory client
- Proxy http client
- Null client to be used in testing

## Install

Add dependency to the client SDK into **package.json** file of your project
```typescript
{
    ...
    "dependencies": {
        ....
        "pip-clients-clusters-node": "^1.0.*",
        ...
    }
}
```

Then install the dependency using **npm** tool
```bash
# Install new dependencies
npm install

# Update already installed dependencies
npm update
```

## Use

Inside your code get the reference to the client SDK
```typescript
 import { ClustersHttpClientV1 } from 'pip-clients-clusters-node';
```

Define client configuration parameters.

```typescript
// Client configuration
var httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);
client.configure(httpConfig);
```

Instantiate the client and open connection to the microservice
```typescript
// Create the client instance
client = new ClustersHttpClientV1();

// Connect to the microservice
client.open(null, function(err) {
    if (err) {
        console.error('Connection to the microservice failed');
        console.error(err);
        return;
    }
    
    // Work with the microservice
    ...
});
```
Now the client is ready to perform operations:

Create new cluster:
```typescript    
    client.createCluster(correlationId: string, cluster: ClusterV1, 
        callback: (err: any, cluster: ClusterV1) => void);
```
Update exists cluster:
```typescript
    client.updateCluster(correlationId: string, cluster: ClusterV1, 
        callback: (err: any, cluster: ClusterV1) => void);
```
Delete existing cluster by cluster_id
```typescript    
    client.deleteClusterById(correlationId: string, cluster_id: string,
        callback: (err: any, cluster: ClusterV1) => void);
```
Add new tenant
```typescript
    client.addTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void);
```
Remove existing tenant by tenantId
```typescript
    client.removeTenant(correlationId: string, tenantId: string, 
        callback: (err: any, cluster: ClusterV1) => void);
```
Get list of all clusters:
```typescript
    client.getClusters(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<ClusterV1>) => void);
```
Get cluster by cluster_id:
```typescript
    client.getClusterById(correlationId: string, cluster_id: string, 
        callback: (err: any, cluster: ClusterV1) => void);
```
Get cluster by tenant:
```typescript
    client.getClusterByTenant(correlationId: string, tenant_id: string, 
        callback: (err: any, cluster: ClusterV1) => void);
```

## Acknowledgements

This client SDK was created and currently maintained by *Sergey Seroukhov*.
