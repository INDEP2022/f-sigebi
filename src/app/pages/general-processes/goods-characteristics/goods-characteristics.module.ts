import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { FileUploadModalComponent } from 'src/app/@standalone/modals/file-upload-modal/file-upload-modal.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsFilterSharedComponent } from '../../../@standalone/shared-forms/goods-shared/goods-filter-shared';
import { GoodPhotosModule } from '../good-photos/good-photos.module';
import { CharacteristicsLegendComponent } from './characteristics-legend/characteristics-legend.component';
import { GoodPhotoComponent } from './good-photos/good-photo/good-photo.component';
import { GoodPhotosComponent } from './good-photos/good-photos.component';
import { GoodsCharacteristicsRoutingModule } from './goods-characteristics-routing.module';
import { GoodCharacteristicCellValueComponent } from './goods-characteristics/good-table-vals/good-cell-value/good-cell-value.component';
import { GoodCharacteristicsTable } from './goods-characteristics/good-table-vals/good-characteristics-table/good-characteristics-table.component';
import { GoodTableDetailButtonComponent } from './goods-characteristics/good-table-vals/good-table-detail-button/good-table-detail-button.component';
import { GoodValueEditWebCarCellComponent } from './goods-characteristics/good-table-vals/good-table-detail-button/good-value-edit-web-car-cell/good-value-edit-web-car-cell.component';
import { GoodValueEditWebCar } from './goods-characteristics/good-table-vals/good-table-detail-button/good-value-edit-web-car/good-value-edit-web-car.component';
import { GoodTableValsComponent } from './goods-characteristics/good-table-vals/good-table-vals.component';
import { GoodsCharacteristicsComponent } from './goods-characteristics/goods-characteristics.component';

@NgModule({
  declarations: [
    GoodsCharacteristicsComponent,
    GoodTableValsComponent,
    GoodTableDetailButtonComponent,
    GoodValueEditWebCar,
    GoodValueEditWebCarCellComponent,
    GoodCharacteristicCellValueComponent,
    GoodCharacteristicsTable,
    CharacteristicsLegendComponent,
    GoodPhotosComponent,
    GoodPhotoComponent,
  ],
  imports: [
    CommonModule,
    GoodsCharacteristicsRoutingModule,
    SharedModule,
    TabsModule,
    GoodPhotosModule,
    GoodsTypesSharedComponent,
    DelegationSharedComponent,
    GoodsFilterSharedComponent,
    FileUploadModalComponent,
    PreviewDocumentsComponent,
    GoodsStatusSharedComponent,
  ],
  exports: [GoodCharacteristicsTable, CharacteristicsLegendComponent],
})
export class GoodsCharacteristicsModule {}
