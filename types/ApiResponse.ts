export default interface ApiResponse {
    readonly status: string;
    readonly data: any;
    readonly traceId?: string | undefined;
}