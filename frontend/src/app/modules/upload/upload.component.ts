import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.styl']
})
export class UploadComponent {
  public URL = 'http://localhost:3031/v1/upload';
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;

  constructor() {
    this.uploader = new FileUploader({ url: this.URL, authToken: 'wjf9479' });
    this.uploader.onAfterAddingFile = file => {
      file.withCredentials = false;
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
}
