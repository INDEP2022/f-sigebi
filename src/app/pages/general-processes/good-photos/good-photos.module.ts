import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodPhotosComponent } from './good-photos.component';
import { GoodPhotosRoutingModule } from './good-photos.routing.module';
import { PhotosHistoricComponent } from './photos-historic/photos-historic.component';
import { PhotoComponent } from './photos-list/photo/photo.component';
import { PhotosListComponent } from './photos-list/photos-list.component';

@NgModule({
  imports: [
    CommonModule,
    GoodPhotosRoutingModule,
    SharedModule,
    TooltipModule,
    FileUploadModalComponent,
    PreviewDocumentsComponent,
  ],
  declarations: [
    GoodPhotosComponent,
    PhotosListComponent,
    PhotoComponent,
    PhotosHistoricComponent,
  ],
  exports: [PhotosListComponent],
})
export class GoodPhotosModule {}
