import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.styl']
})
export class UploadComponent {
  public URL = 'http://localhost:3031/v1/upload';
  public uploader: FileUploader;
  public hasBaseDropZoneOver: boolean = false;
  public showProgress: boolean = false;
  public canDropFiles: string[];
  public wrongFile: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    // Only admins can upload Auctionator database
    if (this.authService.role == 'admin') {
      this.canDropFiles = ['Auctionator', 'BagBrother'];
    } else {
      this.canDropFiles = ['BagBrother'];
    }
    this.uploader = new FileUploader({ url: this.URL, autoUpload: true });
    this.uploader.onAfterAddingFile = fileItem => {
      const fileName = fileItem.file.name;
      const allowedFiles = this.canDropFiles.filter(keyword => {
        const containsKeyword = fileName.includes(keyword);
        const isLua = fileName.includes('.lua');
        return containsKeyword && isLua;
      });
      if (allowedFiles.length === 0) {
        this.uploader.removeFromQueue(fileItem);
        this.wrongFile = true;
      } else {
        this.wrongFile = false;
        fileItem.withCredentials = false;
      }
    };
    this.uploader.onCompleteItem = fileItem => {
      this.showProgress = false;
      const fileName = fileItem.file.name;
      if (fileName.includes('Auctionator')) {
        this.router.navigate(['buying']);
      } else {
        this.router.navigate(['selling']);
      }
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public onFileDrop() {
    if (this.wrongFile) {
      this.showProgress = false;
    } else {
      this.showProgress = true;
    }
  }
}
