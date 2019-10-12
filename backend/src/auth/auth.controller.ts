import { Controller, Post, Body } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import {
  LoginRequestPayload,
  LoginResponse,
} from '../../../shared/models/auth.model';
import { tedis } from '../database/index';

@Controller('auth')
export class AuthController {
  @Post('login')
  async login(@Body() payload: LoginRequestPayload): Promise<LoginResponse> {
    console.log(payload);
    const existingUser = await tedis.hget('users', payload.username);
    console.log(existingUser);
    if (!existingUser) {
      return { success: false, message: "User doesn't exist" };
    }
    const userObject = JSON.parse(existingUser);
    const passwordCorrect = bcrypt.compareSync(
      payload.password,
      userObject.password,
    );
    if (!passwordCorrect) {
      return { success: false, message: 'Incorrect password' };
    }
    const role = userObject.role;
    return {
      success: true,
      data: {
        role: role,
        token: 'ae21f7be-b78f-4346-b7c3-45c47cd2905f',
      },
    };
  }
}
