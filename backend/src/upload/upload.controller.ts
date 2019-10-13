import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { tedis } from '../database/index';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    /**
     * TODO
     * 1. create a map between item id and quality
     *  on event upload update quality list
     * 2. use item id instead of a name
     * 3. create and keep updated a map between item id and name
     */
    const currentTimestamp = new Date().getTime();
    const content = file.buffer.toString();
    const re = /\[\"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\"\] = \"(.*?)\"/g;
    let item = re.exec(content);
    while (item != null) {
      const itemId = item[1];
      const [name, count, quality, minBid, buyout] = item[2].split('||');
      const fullItem = `${count}||${minBid}||${buyout}`;
      tedis.zadd(name, { [fullItem]: currentTimestamp });
      item = re.exec(content);
    }
    // console.log(file.buffer.toString());
    // fs.writeFile('/tmp/123.json', file.buffer, err => {
    //   console.log(err);
    // });
    return {
      success: true,
      data: {},
    };
  }
}
