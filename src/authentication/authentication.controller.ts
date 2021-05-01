import {
  Get,
  Request,
  Response,
  Controller,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { ApiCreatedResponse } from '@nestjs/swagger';
import { AuthenticationService } from './authentication.service';

@Controller('authentication')
export class AuthenticationController {
  constructor(private authService: AuthenticationService) {}

  @Get('/')
  @ApiCreatedResponse({ description: 'Initiate OAuth2 login flow' })
  async initOAuthFlow(@Response() res) {
    try {
      const OAuthLoginURL = await this.authService.generateLoginUrl();

      return res.redirect(OAuthLoginURL);
    } catch (error) {
      throw new HttpException(
        'Something went wrong, Please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/oauth-redirect')
  @ApiCreatedResponse({
    description:
      'Redirect back to the application after a successfull authorization',
  })
  async redirectOAuth(@Request() req, @Response() res) {
    try {
      const authClient = await this.authService.initFusionAuth();

      const payload = await authClient
        .exchangeOAuthCodeForAccessToken(
          req.query.code,
          process.env.FUSIONAUTH_CLIENT_ID,
          process.env.FUSIONAUTH_CLIENT_SECRET,
          process.env.FUSIONAUTH_REDIRECT_URL,
        )
        .then(({ response }) => {
          return response;
        });

      // TODO: Configure cookies
      res.cookie('access_token', payload.access_token);

      return res.redirect(
        process.env.CLIENT_AUTORIZED_REDIRECT +
          '?access_token=' +
          payload.access_token,
      );
    } catch (error) {
      throw new HttpException(
        'Something went wrong, Please try again',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
