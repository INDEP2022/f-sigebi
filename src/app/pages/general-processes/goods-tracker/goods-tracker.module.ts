import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { SelectFractionComponent } from 'src/app/@standalone/modals/select-fraction/select-fraction.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CertificatesFilterComponent } from './components/certificates-filter/certificates-filter.component';
import { ClasificationFilterComponent } from './components/clasification-filter/clasification-filter.component';
import { DataFilterComponent } from './components/data-filter/data-filter.component';
import { GoodsTableComponent } from './components/goods-table/goods-table.component';
import { LocationFilterComponent } from './components/location-filter/location-filter.component';
import { RecordNotificationFilterComponent } from './components/record-notification-filter/record-notification-filter.component';
import { TransferAutorityFilterComponent } from './components/transfer-autority-filter/transfer-autority-filter.component';
import { ViewPhotosComponent } from './components/view-photos/view-photos.component';
import { GoodsTrackerRoutingModule } from './goods-tracker-routing.module';
import { GoodsTrackerComponent } from './goods-tracker/goods-tracker.component';
import { trackedGoodsReducer } from './store/goods-tracker.reducer';
@NgModule({
  declarations: [
    GoodsTrackerComponent,
    ClasificationFilterComponent,
    DataFilterComponent,
    RecordNotificationFilterComponent,
    CertificatesFilterComponent,
    TransferAutorityFilterComponent,
    LocationFilterComponent,
    GoodsTableComponent,
    ViewPhotosComponent,
  ],
  imports: [
    CommonModule,
    GoodsTrackerRoutingModule,
    SharedModule,
    GoodsTypesSharedComponent,
    DocumentsListComponent,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
    CarouselModule,
    AccordionModule,
    SelectFractionComponent,
    StoreModule.forFeature('trackedGoods', trackedGoodsReducer),
  ],
})
export class GoodsTrackerModule {}
