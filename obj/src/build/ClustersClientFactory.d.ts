import { Descriptor } from 'pip-services3-commons-node';
import { Factory } from 'pip-services3-components-node';
export declare class ClustersClientFactory extends Factory {
    static Descriptor: Descriptor;
    static NullClientV1Descriptor: Descriptor;
    static MemoryClientV1Descriptor: Descriptor;
    static DirectClientV1Descriptor: Descriptor;
    static HttpClientV1Descriptor: Descriptor;
    static LambdaClientV1Descriptor: Descriptor;
    constructor();
}
