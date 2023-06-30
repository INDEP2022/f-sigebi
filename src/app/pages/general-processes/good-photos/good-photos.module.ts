import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodPhotosComponent } from './good-photos.component';
import { GoodPhotosRoutingModule } from './good-photos.routing.module';
import { PhotoComponent } from './photos-list/photo/photo.component';
import { PhotosListComponent } from './photos-list/photos-list.component';

@NgModule({
  imports: [
    CommonModule,
    GoodPhotosRoutingModule,
    SharedModule,
    FileUploadModalComponent,
    PreviewDocumentsComponent,
  ],
  declarations: [GoodPhotosComponent, PhotosListComponent, PhotoComponent],
  exports: [PhotosListComponent],
})
export class GoodPhotosModule {}
