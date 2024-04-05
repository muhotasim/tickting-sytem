import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { PermissionService } from "../services/permissions.service";
import { CreatePermissionDTO, UpdatePermissionDTO } from "../dto/permission.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthorizationGuard } from "src/guards/authorization.guard";
import { PermissionGuard } from "src/guards/permission.guard";
import { ResponseType } from "src/utils/custome.datatypes";
import { errorResponse, successResponse } from "src/utils/common.functions";
import messagesConst from "src/utils/message-const.message";
import { GlobalService } from "../services/global.service";
@ApiTags('Permission')
@UseGuards(AuthorizationGuard)
@Controller('permission')
@ApiBearerAuth()
export class PermissionController {
    constructor(private readonly _permissionService: PermissionService, private readonly globalService: GlobalService) { }

    @Get()
    @UseGuards(new PermissionGuard(['can-get-permission-with-count']))
    async index(@Query() query, @Query('page') page: number, @Query('perPage') perPage: number) {
        try {
            const gridData = this.globalService.getGlobalData('permission');
            const data = await this._permissionService.findAndCount(page, perPage,gridData, query)
            return successResponse(data, messagesConst['en'].controller.permission.index, gridData);
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Get('/all')
    @Get()
    @UseGuards(new PermissionGuard(['can-get-permission-with-count']))
    async all() {
        try {
            const data = await this._permissionService.findAll()
            return successResponse(data, messagesConst['en'].controller.permission.all)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Post()
    @Get()
    @UseGuards(new PermissionGuard(['can-create-permission']))
    async create(@Body() createPermissionDTO: CreatePermissionDTO) {
        try {
            const data = await this._permissionService.create(createPermissionDTO)
            return successResponse(data, messagesConst['en'].controller.permission.create)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Patch('/:id')
    @Get()
    @UseGuards(new PermissionGuard(['can-update-permission']))
    async update(@Param('id') id: number, @Body() updatePermissionDTO: UpdatePermissionDTO) {
        try {
            const data = await this._permissionService.update(id, updatePermissionDTO);
            return successResponse(data, messagesConst['en'].controller.permission.update)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Get('/:id')
    @UseGuards(new PermissionGuard(['can-get-single-permission']))
    async getById(@Param('id') id: number) {
        try {
            const data = await this._permissionService.findById(id)
            return successResponse(data, messagesConst['en'].controller.permission.getById)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Delete('/:id')
    @Get()
    @UseGuards(new PermissionGuard(['can-delete-permission']))
    async destroy(@Param('id') id: number) {
        try {
            const data = await this._permissionService.destroy(id);
            return successResponse(data, messagesConst['en'].controller.permission.destroy)
        } catch (e) {
            return errorResponse(e);
        }
    }
}