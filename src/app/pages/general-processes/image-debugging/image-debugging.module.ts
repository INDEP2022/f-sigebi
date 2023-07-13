import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsFilterSharedComponent } from '../../../@standalone/shared-forms/goods-shared/goods-filter-shared';
import { GoodPhotosModule } from '../good-photos/good-photos.module';
import { GoodPhotoComponent } from '../image-debugging/good-photos/good-photo/good-photo/good-photo.component';
import { GoodPhotosComponent } from '../image-debugging/good-photos/good-photos.component';
import { ImageDebuggingModalComponent } from './image-debugging-modal/image-debugging-modal.component';
import { ImageDebuggingRoutingModule } from './image-debugging-routing.module';
import { GoodCharacteristicCellValueComponent } from './image-debugging/good-table-vals/good-cell-value/good-cell-value/good-cell-value.component';
import { GoodTableDetailButtonComponent } from './image-debugging/good-table-vals/good-table-detail-button/good-table-detail-button.component';
import { GoodValueEditWebCarCellComponent } from './image-debugging/good-table-vals/good-table-detail-button/good-value-edit-web-car-cell/good-value-edit-web-car-cell/good-value-edit-web-car-cell.component';
import { GoodValueEditWebCar } from './image-debugging/good-table-vals/good-table-detail-button/good-value-edit-web-car/good-value-edit-web-car/good-value-edit-web-car.component';
import { GoodTableValsComponent } from './image-debugging/good-table-vals/good-table-vals/good-table-vals.component';
import { ImageDebuggingComponent } from './image-debugging/image-debugging.component';

// import { GoodPhotoTableComponent } from './image-debugging/good-table-vals/good-photo-table/good-photo-table/good-photo-table.component';

@NgModule({
  declarations: [
    ImageDebuggingComponent,
    ImageDebuggingModalComponent,
    GoodTableValsComponent,
    GoodTableDetailButtonComponent,
    GoodValueEditWebCar,
    GoodValueEditWebCarCellComponent,
    GoodCharacteristicCellValueComponent,
    GoodPhotosComponent,
    GoodPhotoComponent,
  ],
  imports: [
    CommonModule,
    ImageDebuggingRoutingModule,
    SharedModule,
    TabsModule,
    GoodPhotosModule,
    GoodsTypesSharedComponent,
    DelegationSharedComponent,
    GoodsFilterSharedComponent,
    FileUploadModalComponent,
    PreviewDocumentsComponent,
  ],
})
export class ImageDebuggingModule {}
