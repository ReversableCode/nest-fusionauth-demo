import {
  ExecutionContext,
  createParamDecorator,
  UnauthorizedException,
} from '@nestjs/common';
import FusionAuthClient from '@fusionauth/typescript-client';

export const Authentication = createParamDecorator(
  async (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
      if (!authorization) {
        throw new Error('Unauthorized');
      }

      const [authType, token] = authorization.trim().split(' ');
      if (authType !== 'Bearer') {
        throw new Error('Unauthorized');
      }

      const fusionAuth = new FusionAuthClient(
        process.env.FUSIONAUTH_API_KEY,
        process.env.FUSIONAUTH_URL,
        process.env.FUSIONAUTH_TENANT_ID,
      );

      return await fusionAuth
        .retrieveUserUsingJWT(token)
        .then(({ response }) => {
          return response.user;
        });
    } catch (ex) {
      throw new UnauthorizedException();
    }
  },
);
