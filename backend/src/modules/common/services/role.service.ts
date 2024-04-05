import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FilterGrid } from "src/models/grid.model";
import { Permission } from "src/models/permissions.model";
import { Role } from "src/models/role.model";
import { conditionWapper } from "src/utils/common.functions";
import { FindManyOptions, In, Like, Repository } from "typeorm";

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Role) private readonly _m_Role: Repository<Role>,
        @InjectRepository(Permission) private readonly _m_Permission: Repository<Permission>) { }
    async findAndCount(page: number = 1, perPage: number = 10, grid: FilterGrid[],filterParams: { [key:string]: any }): Promise<{ data: Role[], total: number }> {
        const options: FindManyOptions<Role> = {
            take: perPage,
            skip: perPage * (page - 1),
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
        const [data, total] = await this._m_Role.findAndCount(options);
        return { data, total };
    }

    async findAll(): Promise<Role[]> {
        return await this._m_Role.find();
    }

    async findById(id: number): Promise<Role | null> {
        return await this._m_Role.findOne({ where: { id: id }, relations: ['permissions'] });
    }

    async findPermissionByRoleId(id: number): Promise<Role | null> {
        return await this._m_Role.findOne({ where: { id: id }, relations: ['permissions'] });
    }

    async assignPermissionsToRole(roleId: number, permissionIds: number[]): Promise<Role | false> {
        const role = await this._m_Role.findOne({ where: { id: roleId } });
        if (!role) {
            return false;
        }

        const permissions = await this._m_Permission.find({ where: { id: In(permissionIds) } });
        if (permissions.length !== permissionIds.length) {
            return false;
        }

        role.permissions = permissions;
        await this._m_Role.save(role);
    }

    async create(role): Promise<Role> {
        let permissions = [...role.permissions].map((permission_id)=>{
            const newRolePermission = new Permission();
            newRolePermission.id = permission_id;
            return newRolePermission;
        });
        role.permissions = permissions;
        const tempUser = new Role()
        for(let key of Object.keys(role)){
            tempUser[key] = role[key]
        }
        const newRole = this._m_Role.create(tempUser);
        return await this._m_Role.save(newRole);
    }

    async update(id: number, updateRoleDto): Promise<Role | false> {
        let permissions = [...updateRoleDto.permissions];
        delete updateRoleDto.permissions;
        const roleData = await this._m_Role.findOne({ where: { id: id }, relations: ['permissions'] });
        if (!roleData) {
            return false;
        }

        roleData.permissions = roleData.permissions.filter((permission)=>permissions.includes(permission.id));
        for(let permission of permissions){
            if(roleData.permissions.findIndex(p=>p.id==Number(permission))==-1){
                let newRolePermission = new Permission();
                newRolePermission.id = permission;
                roleData.permissions.push(newRolePermission)
            }
        }
        Object.assign(roleData, updateRoleDto);
        return await this._m_Role.save(roleData);
    }

    async destroy(id: number) {
        const role: Role = await this._m_Role.findOne({ where: { id: id } });
        return await this._m_Role.remove(role)
    }
}