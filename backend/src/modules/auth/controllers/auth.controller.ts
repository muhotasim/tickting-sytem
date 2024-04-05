import { Body, Controller, Get, NotAcceptableException, NotFoundException, Patch, Post, Query, UnauthorizedException, UseGuards } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDTO, ForgotPasswordDTO, LoginDTO, ResetPasswordDTO } from "../dto/auth.dto";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { UserService } from "src/modules/common/services/user.service";
import { User, checkPassword, decodePayload, encodePayload, errorResponse, hashPassword, successResponse, unauthorizeResponse, validationResponse } from "src/utils/common.functions";
import { TokenService } from "src/modules/common/services/token.service";
import { AuthorizationGuard } from "src/guards/authorization.guard";
import { QueueService } from "src/modules/common/services/queue.service";
import { JobTypes, NotificationType, ResponseType } from "src/utils/custome.datatypes";
import messagesConst from "src/utils/message-const.message";
import { NotificationService } from "src/modules/common/services/notification.service";
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly _userService: UserService,
        private readonly _tokenService: TokenService,
        private readonly _jwtService: JwtService,
        private readonly _queueService: QueueService,
        private readonly _notificationService: NotificationService
    ) { }

    @Post('token')
    async login(@Body() body: LoginDTO) {
        try {
            const user = await this._userService.findByEmail(body.email);
            if (!user) {
                return {
                    type: ResponseType.error,
                    data: {},
                    message: messagesConst['en'].userNotFound,
                    validation: []
                };
            }
            const matchPassword = await checkPassword(body.password, user.password);
            if (matchPassword) {
                let payload = { payload: encodePayload({ uId: user.id }) };
                let currentTime = new Date().getTime();
                const acTokenExpiryAt = (parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY) * 1000);
                const rfTokenExpiryAt = (parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY) * 1000);
                const accessToken = await this._jwtService.signAsync(payload, { secret: process.env.JWT_ACCESS_TOKEN_SECRET, expiresIn: acTokenExpiryAt });
                const refreshToken = await this._jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_TOKEN_SECRET, expiresIn: rfTokenExpiryAt });
                const savedToken = await this._tokenService.create({
                    ac_token_expires_at: currentTime + acTokenExpiryAt,
                    access_token: accessToken,
                    rf_token_expires_at: currentTime + rfTokenExpiryAt,
                    refresh_token: refreshToken,
                    user: user
                });
                const data = await this._tokenService.findById(savedToken.id);
                return successResponse(data, messagesConst['en'].login);

            }
            return unauthorizeResponse({}, messagesConst['en'].userPassValidation);
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Post('refresh-token')
    async refreshToken(@Body('refresh_token') refresh_token: string) {
        try {
            const result = await this._jwtService.verify(refresh_token, { secret: process.env.JWT_REFRESH_TOKEN_SECRET })
            const data = decodePayload(result.payload);
            const userId = data.uId;
            const user = await this._userService.findById(userId);
            const tokens = await this._tokenService.activeUserTokens(user);
            const currentToken = tokens.find((token) => token.refresh_token == refresh_token);
            if (currentToken) {
                const tokenId = currentToken.id;
                let currentTime = new Date().getTime();
                let payload = { payload: encodePayload({ uId: user.id }) }
                const acTokenExpiryAt = (parseInt(process.env.JWT_ACCESS_TOKEN_EXPIRY) * 1000);
                const rfTokenExpiryAt = (parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRY) * 1000);
                const accessToken = await this._jwtService.signAsync(payload, { secret: process.env.JWT_ACCESS_TOKEN_SECRET, expiresIn: acTokenExpiryAt });
                const refreshToken = await this._jwtService.signAsync(payload, { secret: process.env.JWT_REFRESH_TOKEN_SECRET, expiresIn: rfTokenExpiryAt });

                const savedToken = await this._tokenService.create({
                    ac_token_expires_at: currentTime + acTokenExpiryAt,
                    access_token: accessToken,
                    rf_token_expires_at: currentTime + rfTokenExpiryAt,
                    refresh_token: refreshToken,
                    user: user
                });
                await this._tokenService.update(tokenId, { ac_token_expires_at: new Date().getTime(), rf_token_expires_at: new Date().getTime() });
                const data = await this._tokenService.findById(savedToken.id);
                return successResponse(data, messagesConst['en'].tokenRefreshed)
            } else {
                return {
                    type: ResponseType.error,
                    data: {},
                    message: messagesConst['en'].failedToRefreshToken,
                    validation: []
                };
            }
        } catch (e) {
            return errorResponse(e);
        }

    }

    @Post('logout')
    @ApiBearerAuth()
    @UseGuards(AuthorizationGuard)
    async logout(@Body('access_token') access_token: string, @User() user) {
        try {
            const tokens = await this._tokenService.activeUserTokens(user);
            const currentToken = tokens.find((token) => token.access_token == access_token);
            const tokenId = currentToken.id;
            await this._tokenService.update(tokenId, { ac_token_expires_at: new Date().getTime(), rf_token_expires_at: new Date().getTime() })

            return successResponse({}, messagesConst['en'].logoutSuccess);
        } catch (e) {
            return errorResponse(e);
        }
    }

    @Post('forgot-password')
    async forgotPassword(@Body() body: ForgotPasswordDTO) {
        try {
            const user = await this._userService.findByEmail(body.email);
            if (!user) {
                throw new NotFoundException()
            }
            let payload = { payload: encodePayload({ uId: user.id }) }
            let expiredTime = new Date(new Date().getTime() + Number(process.env.PASS_RESET_TOKEN_EXPIRY));
            const passwordResetToken = await this._jwtService.signAsync(payload, { secret: process.env.JWT_ACCESS_TOKEN_SECRET, expiresIn: Number(process.env.PASS_RESET_TOKEN_EXPIRY) });
            await this._userService.update(user.id, { password_reset_token: passwordResetToken, password_token_expiry_at: expiredTime })

            const mailData = {
                to: user.email,
                from: process.env.MAIL_HOST,
                subject: "Reset Your Password: Action Required",
                template: 'forgot-pass',
                context: {
                    link: process.env.APP_URL + '/reset-password/' + passwordResetToken,
                    name: user.name
                }
            }
            this._queueService.addJob(JobTypes.mail, mailData);
            return successResponse({}, messagesConst['en'].forgotPasswordMail);
        } catch (e) {
            return errorResponse(e);
        }

    }

    @Patch('reset-password')
    async resetPassword(@Body() body: ResetPasswordDTO) {
        try {
            const result = await this._jwtService.verify(body.token, { secret: process.env.JWT_ACCESS_TOKEN_SECRET })
            const data = decodePayload(result.payload);
            const userId = data.uId;
            const user = await this._userService.findById(userId);
            if (user.password_reset_token == body.token) {
                await this._userService.update(userId, { password: await hashPassword(body.new_password) })
                return successResponse({}, messagesConst['en'].passwordResetSuccess);
            } else {
                return validationResponse({}, messagesConst['en'].resetPasswordNotFound);
            }
        } catch (e) {
            return errorResponse(e);
        }

    }

    @UseGuards(AuthorizationGuard)
    @Get('user')
    @ApiBearerAuth()
    async user(@User() user, @Query('notifications') notificationsNum:number = 10) {
        if (user) {
            delete user.password;
            delete user.tokens;
            delete user.roles;
        }
        const notifications = await this._notificationService.userNotifications(user.id, notificationsNum, NotificationType.app)
        user.notifications = notifications;
        return successResponse(user, messagesConst['en'].userFound)
    }

    @UseGuards(AuthorizationGuard)
    @Patch('update-password')
    @ApiBearerAuth()
    async changePassword(@User() user, @Body() body: ChangePasswordDTO) {
        try {
            const userId = user.id;
            const userData = await this._userService.findById(userId);
            const matchPassword = await checkPassword(body.current_password, userData.password)
            if (matchPassword) {
                await this._userService.update(userId, { password: await hashPassword(body.new_password) })
                return successResponse({}, messagesConst['en'].passwordChangeSuccess)
            } else {
                return validationResponse({}, messagesConst['en'].passwordDoesNotMatch);
            }
        } catch (e) {
            return errorResponse(e);
        }
    }
}