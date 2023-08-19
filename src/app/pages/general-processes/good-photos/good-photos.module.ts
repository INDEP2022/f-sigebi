import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodPhotosComponent } from './good-photos.component';
import { GoodPhotosRoutingModule } from './good-photos.routing.module';
import { PhotosByGoodComponent } from './photos-good/photos-by-good.component';
import { PhotoHistoricComponent } from './photos-historic/photo-historic/photo-historic.component';
import { PhotosHistoricComponent } from './photos-historic/photos-historic.component';
import { PhotoComponent } from './photos-list/photo/photo.component';
import { PhotosListComponent } from './photos-list/photos-list.component';
import { PhotosTabsComponent } from './photos-tabs/photos-tabs.component';
import { CheckBoxComponent } from './table-goods/check-box/check-box.component';
import { TableGoodsComponent } from './table-goods/table-goods.component';

@NgModule({
  imports: [
    CommonModule,
    GoodPhotosRoutingModule,
    SharedModule,
    TooltipModule,
    TabsModule,
    FileUploadModalComponent,
    PreviewDocumentsComponent,
    AccordionModule,
  ],
  declarations: [
    GoodPhotosComponent,
    PhotosListComponent,
    PhotoComponent,
    PhotosHistoricComponent,
    PhotoHistoricComponent,
    PhotosTabsComponent,
    PhotosByGoodComponent,
    TableGoodsComponent,
    CheckBoxComponent,
  ],
  exports: [PhotosTabsComponent],
})
export class GoodPhotosModule {}
