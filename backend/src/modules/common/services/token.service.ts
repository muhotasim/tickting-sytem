import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Token } from "src/models/token.model";
import { User } from "src/models/user.model";
import { LessThan, MoreThan, Repository } from "typeorm";

@Injectable()
export class TokenService {
    constructor(@InjectRepository(Token) private readonly _m_Token: Repository<Token>) {

    }

    async findById(id: number): Promise<Token | null> {
        return await this._m_Token.findOne({ where: { id: id } });
    }

    activeUserTokens(user: User): Promise<Token[]> {
        let tempUser = new User()
        tempUser.id = user.id;
        return this._m_Token.find({ where: {  rf_token_expires_at: MoreThan(new Date().getTime()), user: tempUser } })
    }

    async create(token: Partial<Token>): Promise<Token> {
        const newToken = this._m_Token.create(token);
        return await this._m_Token.save(newToken);
    }

    async update(id: number, updateTokenDto: Partial<Token>): Promise<Token | false> {
        const token = await this._m_Token.findOne({ where: { id: id } });
        if (!token) {
            return false;
        }

        Object.assign(token, updateTokenDto);
        return await this._m_Token.save(token);
    }

    async destroy(id: number) {
        const token: Token = await this._m_Token.findOne({ where: { id: id } });
        return await this._m_Token.delete(token)
    }

    async clearExpiredTokens() {
        await this._m_Token
            .createQueryBuilder('tokens')
            .delete()
            .from(Token)
            .where('ac_token_expires_at < :currentDate AND rf_token_expires_at < :currentDate', { currentDate: new Date().getTime() }).execute()
    }
}