import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { CarouselModule } from 'ngx-bootstrap/carousel';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { DocumentsViewerByFolioComponent } from 'src/app/@standalone/modals/documents-viewer-by-folio/documents-viewer-by-folio.component';
import { SelectFractionComponent } from 'src/app/@standalone/modals/select-fraction/select-fraction.component';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { LinkCellComponent } from 'src/app/@standalone/smart-table/link-cell/link-cell.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActaHistoComponent } from './components/acta-histo/acta-histo.component';
import { AlternClasficationListComponent } from './components/altern-clasfication-list/altern-clasfication-list.component';
import { CertificatesFilterComponent } from './components/certificates-filter/certificates-filter.component';
import { ClasificationFilterComponent } from './components/clasification-filter/clasification-filter.component';
import { DataFilterComponent } from './components/data-filter/data-filter.component';
import { GTrackerDocumentsComponent } from './components/g-tracker-documents/g-tracker-documents.component';
import { GoodsTableComponent } from './components/goods-table/goods-table.component';
import { GtDocumentsListComponent } from './components/gt-documents-list/gt-documents-list.component';
import { LocationFilterComponent } from './components/location-filter/location-filter.component';
import { PhotoGaleryItemComponent } from './components/photo-galery-item/photo-galery-item.component';
import { PhotoGaleryComponent } from './components/photo-galery/photo-galery.component';
import { RecordNotificationFilterComponent } from './components/record-notification-filter/record-notification-filter.component';
import { TransferAutorityFilterComponent } from './components/transfer-autority-filter/transfer-autority-filter.component';
import { ViewPhotosComponent } from './components/view-photos/view-photos.component';
import { WarehousesFilterComponent } from './components/warehouses-filter/warehouses-filter.component';
import { GoodsTrackerRoutingModule } from './goods-tracker-routing.module';
import { GoodsTrackerComponent } from './goods-tracker/goods-tracker.component';
import {
  trackedGoodsReducer,
  trackerFilterReducer,
} from './store/goods-tracker.reducer';
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
    ActaHistoComponent,
    GTrackerDocumentsComponent,
    AlternClasficationListComponent,
    PhotoGaleryComponent,
    PhotoGaleryItemComponent,
    GtDocumentsListComponent,
    WarehousesFilterComponent,
  ],
  imports: [
    CommonModule,
    GoodsTrackerRoutingModule,
    SharedModule,
    LinkCellComponent,
    GoodsTypesSharedComponent,
    DocumentsListComponent,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
    CarouselModule,
    AccordionModule,
    DocumentsViewerByFolioComponent,
    SelectFractionComponent,
    StoreModule.forFeature('trackedGoods', trackedGoodsReducer),
    StoreModule.forFeature('trackerFilter', trackerFilterReducer),
    FormLoaderComponent,
    TooltipModule,
  ],
})
export class GoodsTrackerModule {}
