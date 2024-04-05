import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { RoleService } from "../services/role.service";
import { CreateRoleDTO, UpdateRoleDTO } from "../dto/role.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthorizationGuard } from "src/guards/authorization.guard";
import { PermissionGuard } from "src/guards/permission.guard";
import { errorResponse, successResponse } from "src/utils/common.functions";
import messagesConst from "src/utils/message-const.message";
import { GlobalService } from "../services/global.service";

@ApiTags('Roles')
@UseGuards(AuthorizationGuard)
@Controller('roles')
@ApiBearerAuth()
export class RoleController {
    constructor(private readonly _roleService: RoleService, private readonly globalService: GlobalService) { }
    @Get()
    @UseGuards(new PermissionGuard(['can-get-roles-with-count']))
    async index(@Query() query, @Query('page') page: number, @Query('perPage') perPage: number) {
        try {
            const gridData = this.globalService.getGlobalData('roles');
            const data = await this._roleService.findAndCount(page, perPage,gridData, query);
            return successResponse(data, messagesConst['en'].controller.role.index, gridData);
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Get('/all')
    @UseGuards(new PermissionGuard(['can-get-all-roles']))
    async all() {
        try {
            const data = await this._roleService.findAll();
            return successResponse(data, messagesConst['en'].controller.role.all)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Post()
    @UseGuards(new PermissionGuard(['can-create-role']))
    async create(@Body() createRoleDTO: CreateRoleDTO) {
        try {
            const data = await this._roleService.create(createRoleDTO);
            return successResponse(data, messagesConst['en'].controller.role.create)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Patch('/:id')
    @UseGuards(new PermissionGuard(['can-update-role']))
    async update(@Param('id') id: number, @Body() updateRoleDTO: UpdateRoleDTO) {
        try {
            const data = await this._roleService.update(id, updateRoleDTO)
            return successResponse(data, messagesConst['en'].controller.role.update)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Get('/:id')
    @UseGuards(new PermissionGuard(['can-get-single-role']))
    async getById(@Param('id') id: number) {
        try {
            const data = await this._roleService.findById(id)
            return successResponse(data, messagesConst['en'].controller.role.getById)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Delete('/:id')
    @UseGuards(new PermissionGuard(['can-delete-role']))
    async destroy(@Param('id') id: number) {
        try {
            const data = await this._roleService.destroy(id);
            return successResponse(data, messagesConst['en'].controller.role.destroy)
        } catch (e) {
            return errorResponse(e);
        }
    }
}