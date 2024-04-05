import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FilterGrid } from "src/models/grid.model";
import { Role } from "src/models/role.model";
import { User } from "src/models/user.model";
import { conditionWapper } from "src/utils/common.functions";
import { FindManyOptions, Like, Repository } from "typeorm";

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private readonly _m_User: Repository<User>) { }

    async findAndCount(page: number = 1, perPage: number = 10, grid: FilterGrid[],filterParams: { [key:string]: any }): Promise<{ data: User[], total: number }> {
        const options: FindManyOptions<User> = {
            take: perPage,
            skip: perPage * (page - 1),
            relations: ['roles']
        };
        delete filterParams.perPage
        delete filterParams.page
        if ( Object.keys(filterParams).length) {
            options.where = {};
            for(let key of Object.keys(filterParams)){
                let gridData = grid.find(g=>g.effect_on==key);
                if(filterParams[key]){
                    if(gridData){
                        options.where[key]=conditionWapper(gridData.condition,filterParams[key])
                    }else{
                        options.where[key]=filterParams[key];
                    }
                }
                
            }

            if (filterParams.is_active != null) {
                options.where.is_active= filterParams.is_active;
            }
        }
        const [data, total] = await this._m_User.findAndCount(options);
        return { data, total };
    }

    async findAll(): Promise<User[]> {
        return await this._m_User.find();
    }

    async findById(id: number): Promise<User | null> {
        return await this._m_User.findOne({ where: { id: id }, relations: ['roles'] });
    }

    async user(id: number) {

        const userInfo = await this._m_User
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .leftJoinAndSelect('user.roles', 'roles')
            .leftJoinAndSelect('roles.permissions', 'permissions')
            .leftJoinAndSelect('user.tokens', 'tokens', 'tokens.ac_token_expires_at > :currentDate OR tokens.rf_token_expires_at > :currentDate', { currentDate: new Date().getTime() })
            .select([
                'user',
                'roles',
                'tokens',
                'permissions.permission_key'
            ])
            .getOne();
        let permissions = [];

        for (let role of userInfo.roles) {
            role.permissions.forEach((permission_key) => {
                permissions.push(permission_key)
            })
        }
        let userObj = { ...userInfo, permissions: permissions };
        delete userObj.roles

        return userObj;
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this._m_User.findOne({ where: { email: email } });
    }

    async findRolesByUserId(id: number) {
        return await this._m_User.findOne({ where: { id: id }, relations: ['roles'] });
    }

    async findPermissionByUserId(id: number) {
        return await this._m_User.findOne({ where: { id: id }, relations: ['roles', 'roles.permissions'] });
    }

    async create(user): Promise<User> {
        let roles = [...user.roles].map((role_id)=>{
            const newUserRole = new Role();
            newUserRole.id = role_id;
            return newUserRole;
        });
        user.roles = roles;
        const tempUser = new User()
        for(let key of Object.keys(user)){
            tempUser[key] = user[key]
        }
        const newUser = this._m_User.create(tempUser);
        return await this._m_User.save(newUser);
    }

    async update(id: number, updateUserDto): Promise<User | false> {
        let roles = [...updateUserDto.roles];
        delete updateUserDto.roles;
        const user = await this._m_User.findOne({ where: { id: id }, relations: ['roles'] });
        if (!user) {
            return false;
        }

        user.roles = user.roles.filter((role)=>roles.includes(role.id));
        for(let role of roles){
            if(user.roles.findIndex(role=>role.id==Number(role))==-1){
                let newUserRole = new Role();
                newUserRole.id = role;
                user.roles.push(newUserRole)
            }
        }
        
        Object.assign(user, updateUserDto);
        return await this._m_User.save(user);
    }

    async destroy(id: number) {
        const user: User = await this._m_User.findOne({ where: { id: id } });
        return await this._m_User.remove(user)
    }
}