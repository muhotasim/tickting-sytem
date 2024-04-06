import { ApiService } from "./api.service";

export class TicketApiService extends ApiService{
    constructor(apiUrl: string, token: string | null = null) {
        super(apiUrl, token);
    }

    async list(page:number, perPage: number, filters: {[key:string]: any} = {}){
        return await this.get({path: 'tickets', query: {page , perPage, ...filters}, allowAborate: true})
    }
    async comments(id:number){
        return await this.get({path: 'tickets/comments/'+id, query: {}, allowAborate: true})
    }
    async create(body: {[key:string]: any}|FormData){
        return await this.post({path: 'tickets',body:body, allowAborate: true})
    }

    async update(id:number|string,body: {[key:string]: any}|FormData){
        return await this.patch({path: 'tickets/'+id,body:body, allowAborate: true})
    }


    async getById(id:number|string){
        return await this.get({path: 'tickets/'+id, allowAborate: true})
    }

    async destroy(id:number|string){
        return await this.delete({path: 'tickets/'+id, allowAborate: true})
    }
}