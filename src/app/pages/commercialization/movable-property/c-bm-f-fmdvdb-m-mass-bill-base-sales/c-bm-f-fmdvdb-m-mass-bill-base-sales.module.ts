import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';

import { ReactiveFormsModule } from '@angular/forms';
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';

import { CBmFFmdvdbMMassBillBaseSalesRoutingModule } from './c-bm-f-fmdvdb-m-mass-bill-base-sales-routing.module';
import { CBmFFmdvdbCBaseSalesPreInvoicingComponent } from './c-bm-f-fmdvdb-c-base-sales-pre-invoicing/c-bm-f-fmdvdb-c-base-sales-pre-invoicing.component';
import { CBmFFmdvdbCSatCatalogsComponent } from './c-bm-f-fmdvdb-c-sat-catalogs/c-bm-f-fmdvdb-c-sat-catalogs.component';
import { CBmFFmdvdbCErrorsNullDataComponent } from './c-bm-f-fmdvdb-c-errors-null-data/c-bm-f-fmdvdb-c-errors-null-data.component';
import { SeparateFoliosModalComponent } from './separate-folios-modal/separate-folios-modal.component';


@NgModule({
  declarations: [
    CBmFFmdvdbCBaseSalesPreInvoicingComponent,
    CBmFFmdvdbCSatCatalogsComponent,
    CBmFFmdvdbCErrorsNullDataComponent,
    SeparateFoliosModalComponent
  ],
  imports: [
    CommonModule,
    CBmFFmdvdbMMassBillBaseSalesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    PreviewDocumentsComponent,
    ReactiveFormsModule,
    EventsSharedComponent
  ],
  exports: [
    CBmFFmdvdbCBaseSalesPreInvoicingComponent,
    CBmFFmdvdbCSatCatalogsComponent,
    CBmFFmdvdbCErrorsNullDataComponent
  ]
})
export class CBmFFmdvdbMMassBillBaseSalesModule { }
