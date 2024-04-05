import { ApiService } from "./api.service";

export class AuthApiService extends ApiService{
    constructor(apiUrl: string, token: string | null = null) {
        super(apiUrl, token);
    }

    async requestToken(email:string, password: string){
        return await this.post({path: 'auth/token', body: { email, password }})
    }

    async notifications(page:number, perPage: number, filters: {[key:string]: any} = {}){
        return await this.get({path: 'notifications', query: {page , perPage, ...filters}, allowAborate: true})
    }

    async refreshToken(refreshToken: string){
        return await this.post({path: 'auth/refresh-token', body: { refresh_token: refreshToken }})
    }
    
    async logout(){
        return await this.post({path: 'auth/logout', body: { access_token: this.accessToken }})
    }

    async forgotPassword(email:string){
        return await this.post({path: 'auth/forgot-password', body: { email: email }})
    }

    async resetPassword(newPassword: string){
        return await this.patch({path: 'auth/reset-password', body: { token: this.accessToken, new_password: newPassword }})
    }

    async user(numberOfNotification:number = 5){
        return await this.get({path: 'auth/user', query: {notifications: numberOfNotification}})
    }

    async changePassword(currentPassword:string, newPassword:string){
        return await this.patch({path: 'auth/update-password', body: { current_password: currentPassword, new_password: newPassword }});
    }
}