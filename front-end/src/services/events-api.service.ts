import { ApiService } from "./api.service";

export class EventApiService extends ApiService{
    constructor(apiUrl: string, token: string | null = null) {
        super(apiUrl, token);
    }

    events(){
        return this.get({path: 'events', allowAborate: true})
    }


}