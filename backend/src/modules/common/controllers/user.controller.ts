import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { CreateUserDTO, UpdateUserDTO } from "../dto/users.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { errorResponse, hashPassword, successResponse } from "src/utils/common.functions";
import { AuthorizationGuard } from "src/guards/authorization.guard";
import { PermissionGuard } from "src/guards/permission.guard";
import messagesConst from "src/utils/message-const.message";
import { GlobalService } from "../services/global.service";

@ApiTags('Users')
@UseGuards(AuthorizationGuard)
@Controller('users')
@ApiBearerAuth() 
export class UserController {
    constructor(private readonly _userService: UserService, private readonly globalService: GlobalService) { }
    @Get()
    @UseGuards(new PermissionGuard(['can-get-users-with-count']))
    async index(@Query() query, @Query('page') page: number, @Query('perPage') perPage: number) {
        try {
            const gridData = this.globalService.getGlobalData('users');
            const data = await this._userService.findAndCount(page, perPage,gridData, query);
            return successResponse(data, messagesConst['en'].controller.users.index, gridData)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Post()
    @UseGuards(new PermissionGuard(['can-create-user']))
    async create(@Body() createUserDTO: CreateUserDTO) {
        try {
            createUserDTO.password = await hashPassword(createUserDTO.password);
            const data = await this._userService.create(createUserDTO);
            return successResponse(data, messagesConst['en'].controller.users.create)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Patch('/:id')
    @UseGuards(new PermissionGuard(['can-update-user']))
    async update(@Param('id') id: number, @Body() updateUserDTO: UpdateUserDTO) {
        try {
            const user = await this._userService.findById(id);
            if (user && user.password != updateUserDTO.password) {
                updateUserDTO.password = await hashPassword(updateUserDTO.password);
            }
            const data = await this._userService.update(id, updateUserDTO);
            return successResponse(data, messagesConst['en'].controller.users.update)
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Get('/:id')
    @UseGuards(new PermissionGuard(['can-get-single-user']))
    async getById(@Param('id') id: number) {
        try {
            const data = await this._userService.findById(id);
            return successResponse(data, messagesConst['en'].controller.users.getById);
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Delete('/:id')
    @UseGuards(new PermissionGuard(['can-delete-user']))
    async destroy(@Param('id') id: number) {
        try {
            const data = await this._userService.destroy(id);
            return successResponse(data, messagesConst['en'].controller.users.destroy);
        } catch (e) {
            return errorResponse(e);
        }
    }
}