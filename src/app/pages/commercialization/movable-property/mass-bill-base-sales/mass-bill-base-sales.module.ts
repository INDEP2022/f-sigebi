import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { ReactiveFormsModule } from '@angular/forms';
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';

import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { AuthorizationSOIModalComponent } from './base-sales-pre-invoicing/authorization-modal/authorization-modal.component';
import { BaseSalesPreInvoicingComponent } from './base-sales-pre-invoicing/base-sales-pre-invoicing.component';
import { ErrorsNullDataComponent } from './errors-null-data/errors-null-data.component';
import { MassBillBaseSalesRoutingModule } from './mass-bill-base-sales-routing.module';
import { SatCatalogsComponent } from './sat-catalogs/sat-catalogs.component';
import { UseModalComponent } from './sat-catalogs/use-comp/use-modal.component';
import { SeparateFoliosModalComponent } from './separate-folios-modal/separate-folios-modal.component';

@NgModule({
  declarations: [
    BaseSalesPreInvoicingComponent,
    SatCatalogsComponent,
    ErrorsNullDataComponent,
    SeparateFoliosModalComponent,
    UseModalComponent,
    AuthorizationSOIModalComponent,
  ],
  imports: [
    CommonModule,
    MassBillBaseSalesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
    ReactiveFormsModule,
    EventsSharedComponent,
    FormLoaderComponent,
  ],
  exports: [
    BaseSalesPreInvoicingComponent,
    SatCatalogsComponent,
    ErrorsNullDataComponent,
    UseModalComponent,
  ],
})
export class MassBillBaseSalesModule {}
