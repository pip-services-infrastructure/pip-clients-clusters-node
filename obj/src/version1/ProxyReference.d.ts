export declare class ProxyReference<T> {
    created: number;
    connected: number;
    url: string;
    protocol: string;
    host: string;
    port: number;
    client?: T;
}
