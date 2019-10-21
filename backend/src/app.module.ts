import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UploadController } from './upload/upload.controller';
import { ItemsController } from './items/items.controller';
import { UploadService } from './upload/upload.service';
import { ItemsService } from './items/items.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    UploadController,
    ItemsController,
  ],
  providers: [AppService, UploadService, ItemsService],
})
export class AppModule {}
