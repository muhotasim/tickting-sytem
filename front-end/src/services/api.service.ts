import { rootStore } from "../store";
import { clearCookie, getCookie, setCookie } from "../utils/common.functions";
import { QueryParams } from "../utils/common.interfaces";
import { ResponseType } from "../utils/contome.datatype";
export enum HTTPMethods { GET = 'GET', PUT = 'PUT', POST = 'POST', PATCH = 'PATCH', DELETE = 'DELETE' };
export class ApiService {
    constructor(protected readonly apiUrl: string, protected accessToken: string | null = null) { 
        const token = getCookie('access_token');
        if(token){
            this.accessToken = token;
        }
    }
    private async apiCaller({ method = HTTPMethods.POST, path, query = {}, body = {}, allowAborate = false }: { allowAborate?: boolean, method: HTTPMethods, path: string, query?: QueryParams, body?: { [key: string]: any } | FormData }): Promise<any> {
        const fetchOptions: { [key: string]: any } = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
        };
        if (this.accessToken) {
            fetchOptions.headers['Authorization'] = `Bearer ${this.accessToken}`;
        }
        if (body) {
            if (body instanceof FormData) {
                fetchOptions.body = body;
            } else {
                if (Object.keys(body).length) fetchOptions.body = JSON.stringify(body);
            }
        }
        let urlSearchParam = new URLSearchParams();
        for (let key of Object.keys(query)) {
            urlSearchParam.append(key, query[key])
        }
        let searchParamStr = urlSearchParam.toString()
    
        let url = `${this.apiUrl}/${path}${searchParamStr ? '?' + searchParamStr : ''}`;
        
        try {
            const response = await fetch(url, fetchOptions);
            const data = await response.json();
            if(data.type == ResponseType.unauthorize){
                clearCookie('access_token')
                clearCookie('access_token_expiry_at')
                clearCookie('refresh_token')
                clearCookie('refresh_token_expiry_at')
                window.location.reload();
            }
            return data;
        } catch (error) {

            console.error('Error:', error);
            throw error;
        }
    }

    updateAccessToken(accessToken: string, tokenExpiry: number) {
        this.accessToken = accessToken;
        setCookie('access_token', accessToken, tokenExpiry);
    }
    async get({ path, query = {}, allowAborate = false }: { allowAborate?: boolean, path: string, query?: QueryParams }) {
        return await this.apiCaller({ method: HTTPMethods.GET, path: path, query: query, allowAborate })
    }
    async post({ path, query = {}, body = {}, allowAborate = false }: { allowAborate?: boolean, path: string, query?: QueryParams, body?: { [key: string]: any } | FormData }) {
        return await this.apiCaller({ method: HTTPMethods.POST, path, query, body, allowAborate });
    }
    async put({ path, query = {}, body = {}, allowAborate = false }: { allowAborate?: boolean, path: string, query?: QueryParams, body?: { [key: string]: any } | FormData }) {
        return await this.apiCaller({ method: HTTPMethods.PUT, path, query, body, allowAborate });
    }
    async patch({ path, query = {}, body = {}, allowAborate = false }: { allowAborate?: boolean, path: string, query?: QueryParams, body?: { [key: string]: any } | FormData }) {
        return await this.apiCaller({ method: HTTPMethods.PATCH, path, query, body, allowAborate });
    }
    async delete({ path, query = {}, body = {}, allowAborate = false }: { allowAborate?: boolean, path: string, query?: QueryParams, body?: { [key: string]: any } | FormData }) {
        return await this.apiCaller({ method: HTTPMethods.DELETE, path, query, body, allowAborate });
    }
}