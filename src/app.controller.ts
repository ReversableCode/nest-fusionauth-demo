import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';
import { User } from '@fusionauth/typescript-client';
import { Authentication } from './authentication.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/user')
  async getUser(@Authentication() user: User) {
    return JSON.stringify(user);
  }
}
