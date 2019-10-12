import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import fs = require('fs');

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    console.log(file.buffer.toString());
    fs.writeFile('/tmp/123.json', file.buffer, err => {
      console.log(err);
    });
    return {
      success: true,
      data: {},
    };
  }
}
