import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalGuardaValorComponent } from './modal-guarda-valor/modal-guarda-valor.component';
import { ReceiptDocumentsArchiveComponent } from './receipt-documents-archive/receipt-documents-archive.component';
import { ReceiptDocumentsArchivepRoutingModule } from './receipt-documents-archivep-routing.module';
import { TableDataComponent } from './tools/table-data/table-data.component';

@NgModule({
  declarations: [
    ReceiptDocumentsArchiveComponent,
    ModalGuardaValorComponent,
    TableDataComponent,
  ],
  imports: [
    CommonModule,
    ReceiptDocumentsArchivepRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class ReceiptDocumentsArchivepModule {}
