import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ResponseType } from './custome.datatypes';
import { Equal, LessThan, Like, MoreThan } from 'typeorm';

const saltOrRounds = 10;

export const hashPassword = async (password: string) => {
    return await bcrypt.hash(password, saltOrRounds);
}
export const checkPassword = async (password: string, hashedString: string) => {
    return await bcrypt.compare(password, hashedString)
}
export const encodePayload = (payload: any): string => {
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64');
    const hmac = crypto.createHmac('sha256', process.env.JWT_ACCESS_TOKEN_SECRET);
    hmac.update(encodedPayload);
    const signature = hmac.digest('hex');
    return `${encodedPayload}.${signature}`;
}

export const decodePayload = (encodedPayloadWithSignature: string): any => {
    const [encodedPayload, signature] = encodedPayloadWithSignature.split('.');
    const hmac = crypto.createHmac('sha256', process.env.JWT_ACCESS_TOKEN_SECRET);
    hmac.update(encodedPayload);
    const calculatedSignature = hmac.digest('hex');
    if (calculatedSignature !== signature) {
        throw new Error('Invalid signature');
    }
    return JSON.parse(Buffer.from(encodedPayload, 'base64').toString('utf-8'));
}
export const User = createParamDecorator(
    (data: unknown, context: ExecutionContext) => {
        const request = context.switchToHttp().getRequest();
        return request.user;
    },
);

export const errorResponse = (e:Error)=>{
    return {
        type: ResponseType.error,
        data: {},
        message: e.message,
        validation: []
    }
} 
export const successResponse = (data, message, gridData = [])=>{
    return {
        type: ResponseType.success,
        data: data,
        message: message,
        validation: [],
        grid: gridData
    }
}
export const unauthorizeResponse = (data, message)=>{
    return {
        type: ResponseType.unauthorize,
        data: data,
        message: message,
        validation: []
    }
}
export const validationResponse = (data, message)=>{
    return {
        type: ResponseType.validate,
        data: data,
        message: message,
        validation: []
    }
}

export const filterConditions = {
    'like': Like,
    '=': Equal,
    '>': LessThan,
    '<': MoreThan,
}

export const conditionWapper = (condition, value)=>{
    if(filterConditions[condition]){
        if(condition=='like'){

            return filterConditions[condition](`%${value}%`)
        }else{
            return filterConditions[condition](`${value}`)
        }
    }else{
        return value;
    }
}