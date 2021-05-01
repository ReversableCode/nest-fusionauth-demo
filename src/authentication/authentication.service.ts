import { Injectable } from '@nestjs/common';
import FusionAuthClient from '@fusionauth/typescript-client';

@Injectable()
export class AuthenticationService {
  async generateLoginUrl() {
    return (
      process.env.OAUTH_LOGIN_FLOW +
      '?client_id=' +
      process.env.FUSIONAUTH_CLIENT_ID +
      '&response_type=code&redirect_uri=' +
      process.env.FUSIONAUTH_REDIRECT_URL
    );
  }

  async initFusionAuth(): Promise<FusionAuthClient> {
    return new FusionAuthClient(
      process.env.FUSIONAUTH_API_KEY,
      process.env.FUSIONAUTH_URL,
      process.env.FUSIONAUTH_TENANT_ID,
    );
  }
}
