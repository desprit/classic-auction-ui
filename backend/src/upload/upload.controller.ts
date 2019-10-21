import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    let data;
    switch (true) {
      case file.originalname.includes('Auctionator'):
        await this.uploadService.processAuctionatorFile(file);
        break;
      case file.originalname.includes('BagBrother'):
        data = await this.uploadService.processBagbrotherFile(file);
        break;
      default:
        console.error('File not supported.');
    }
    return {
      success: true,
      data,
    };
  }
}
