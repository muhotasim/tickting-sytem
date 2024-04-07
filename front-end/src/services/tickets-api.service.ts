import { ApiService } from "./api.service";

export class TicketApiService extends ApiService{
    constructor(apiUrl: string, token: string | null = null) {
        super(apiUrl, token);
    }

    async list(page:number, perPage: number, filters: {[key:string]: any} = {}){
        return await this.get({path: 'tickets', query: {page , perPage, ...filters}, allowAborate: true})
    }

    async makeComment({ticket_id, comment, parent_id}:{ticket_id:number, comment:string, parent_id: any}){
        return await this.post({path: 'tickets/comment', query: {}, body: { ticket_id, comment, parent_id }, allowAborate: true})
    }
    async takeControl({ticket_id, user_id}:{ticket_id:number, user_id: number}){
        return await this.patch({path: 'tickets/assign/'+ticket_id, query: {}, body: { assign_to: user_id }, allowAborate: true})
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

    async resolveTicket(id:number|string){
        return await this.post({path: 'tickets/'+id+'/resolve', allowAborate: true})
    }
    async getById(id:number|string){
        return await this.get({path: 'tickets/'+id, allowAborate: true})
    }

    async destroy(id:number|string){
        return await this.delete({path: 'tickets/'+id, allowAborate: true})
    }
}