import ApiResponse from "@/types/ApiResponse";

export function throwApiResponseError(response: ApiResponse) {
    if (response.status === 'error') {
        throw response;
    }
}

export function isApiResponseError(err: any) {
    return true;
}