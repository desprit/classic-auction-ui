import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { UploadController } from './upload/upload.controller';
import { SearchController } from './search/search.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    UploadController,
    SearchController,
  ],
  providers: [AppService],
})
export class AppModule {}
