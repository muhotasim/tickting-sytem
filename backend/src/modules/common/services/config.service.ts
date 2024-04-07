import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
    private config: any;
    
    setConfig(conf: any) {
        this.config = conf;
    }

    getConfigByKey(key) {
        return this.config[key];
    }

    getConfig(){
        return this.config;
    }
}