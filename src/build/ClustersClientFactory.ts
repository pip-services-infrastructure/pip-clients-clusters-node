import { Descriptor } from 'pip-services3-commons-node';
import { Factory } from 'pip-services3-components-node';

import { ClustersNullClientV1 } from '../clients/version1/ClustersNullClientV1';
import { ClustersMemoryClientV1 } from '../clients/version1/ClustersMemoryClientV1';
import { ClustersDirectClientV1 } from '../clients/version1/ClustersDirectClientV1';
import { ClustersHttpClientV1 } from '../clients/version1/ClustersHttpClientV1';
import { ClustersLambdaClientV1 } from '../clients/version1/ClustersLambdaClientV1';

export class ClustersClientFactory extends Factory {
	public static Descriptor: Descriptor = new Descriptor('pip-services-clusters', 'factory', 'default', 'default', '1.0');
	public static NullClientV1Descriptor = new Descriptor('pip-services-clusters', 'client', 'null', 'default', '1.0');
	public static MemoryClientV1Descriptor = new Descriptor('pip-services-clusters', 'client', 'memory', 'default', '1.0');
	public static DirectClientV1Descriptor = new Descriptor('pip-services-clusters', 'client', 'direct', 'default', '1.0');
	public static HttpClientV1Descriptor = new Descriptor('pip-services-clusters', 'client', 'http', 'default', '1.0');
	public static LambdaClientV1Descriptor = new Descriptor('pip-services-clusters', 'client', 'lambda', 'default', '1.0');
	
	constructor() {
		super();

		this.registerAsType(ClustersClientFactory.NullClientV1Descriptor, ClustersNullClientV1);
		this.registerAsType(ClustersClientFactory.MemoryClientV1Descriptor, ClustersMemoryClientV1);
		this.registerAsType(ClustersClientFactory.DirectClientV1Descriptor, ClustersDirectClientV1);
		this.registerAsType(ClustersClientFactory.HttpClientV1Descriptor, ClustersHttpClientV1);
		this.registerAsType(ClustersClientFactory.LambdaClientV1Descriptor, ClustersLambdaClientV1);
	}
	
}
