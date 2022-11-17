import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { FileUploadComponent } from './components/file-upload.component';
import { FileUploadService } from './service/file-upload.service';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [CommonModule, NgxDropzoneModule, ProgressbarModule],
  exports: [FileUploadComponent],
  providers: [FileUploadService],
})
export class FileUploadModule {}
