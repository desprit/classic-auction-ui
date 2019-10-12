import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { UploadController } from './upload/upload.controller';

@Module({
  imports: [],
  controllers: [AppController, AuthController, UploadController],
  providers: [AppService, AuthService],
})
export class AppModule {}
