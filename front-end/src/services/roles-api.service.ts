import { ApiService } from "./api.service";

export class RoleApiService extends ApiService{
    constructor(apiUrl: string, token: string | null = null) {
        super(apiUrl, token);
    }

    async list(page:number, perPage: number, filters: {[key:string]: any} = {}){
        return await this.get({path: 'roles', query: {page , perPage, ...filters}, allowAborate: true})
    }

    async all(){
        return await this.get({path: 'roles/all', query: {all: 1}, allowAborate: true})
    }
    
    async create(body: {[key:string]: any}|FormData){
        return await this.post({path: 'roles',body:body, allowAborate: true})
    }

    async update(id:number|string,body: {[key:string]: any}|FormData){
        return await this.patch({path: 'roles/'+id,body:body, allowAborate: true})
    }


    async getById(id:number|string){
        return await this.get({path: 'roles/'+id, allowAborate: true})
    }


    async destroy(id:number|string){
        return await this.delete({path: 'roles/'+id, allowAborate: true})
    }
}