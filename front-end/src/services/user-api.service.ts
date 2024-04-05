import { ApiService } from "./api.service";

export class UserApiService extends ApiService{
    constructor(apiUrl: string, token: string | null = null) {
        super(apiUrl, token);
    }

    async list(page:number, perPage: number, filters: {[key:string]: any} = {}){
        return await this.get({path: 'users', query: {page , perPage, ...filters}, allowAborate: true})
    }
    
    async create(body: {[key:string]: any}|FormData){
        return await this.post({path: 'users',body:body, allowAborate: true})
    }

    async update(id:number|string,body: {[key:string]: any}|FormData){
        return await this.patch({path: 'users/'+id,body:body, allowAborate: true})
    }


    async getById(id:number|string){
        return await this.get({path: 'users/'+id, allowAborate: true})
    }

    async destroy(id:number|string){
        return await this.delete({path: 'users/'+id, allowAborate: true})
    }
}