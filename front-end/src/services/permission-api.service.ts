import { ApiService } from "./api.service";

export class PermissionApiService extends ApiService{
    constructor(apiUrl: string, token: string | null = null) {
        super(apiUrl, token);
    }

    async list(page:number, perPage: number, filters: {[key:string]: any} = {}){
        return await this.get({path: 'permission', query: {page , perPage, ...filters}, allowAborate: true})
    }

    async all(){
        return await this.get({path: 'permission/all', query: {all: 1}, allowAborate: true})
    }
    
    async create(body: {[key:string]: any}|FormData){
        return await this.post({path: 'permission',body:body, allowAborate: true})
    }

    async update(id:number|string,body: {[key:string]: any}|FormData){
        return await this.patch({path: 'permission/'+id,body:body, allowAborate: true})
    }


    async getById(id:number|string){
        return await this.get({path: 'permission/'+id, allowAborate: true})
    }


    async destroy(id:number|string){
        return await this.delete({path: 'permission/'+id, allowAborate: true})
    }
}