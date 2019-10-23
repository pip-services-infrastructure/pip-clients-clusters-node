export class ProxyReference<T> {
    public created: number;
    public connected: number;
    public url: string;
    public protocol: string;
    public host: string;
    public port: number;
    public client?: T;
}