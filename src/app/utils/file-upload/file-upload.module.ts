import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadComponent } from './components/file-upload.component';
import { FileUploadService } from './service/file-upload.service';

@NgModule({
  declarations: [FileUploadComponent],
  imports: [CommonModule, NgxDropzoneModule, ProgressbarModule, SharedModule],
  exports: [FileUploadComponent],
  providers: [FileUploadService],
})
export class FileUploadModule {}
