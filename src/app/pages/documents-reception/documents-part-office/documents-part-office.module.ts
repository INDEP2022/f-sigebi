import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DocumentsListComponent } from 'src/app/@standalone/documents-list/documents-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { DocumentPartOfficeModalComponent } from './document-part-office-modal/document-part-office-modal.component';
import { DocumentsPartOfficeRoutingModule } from './documents-part-office-routing.module';
import { DocumentsPartOfficeModalTableComponent } from './documents-part-office/components/documents-part-office-modal-table/documents-part-office-modal-table.component';
import { TurnPaperworkComponent } from './documents-part-office/components/turn-paperwork/turn-paperwork.component';
import { DocumentsPartOfficeComponent } from './documents-part-office/documents-part-office.component';

@NgModule({
  declarations: [
    DocumentsPartOfficeModalTableComponent,
    TurnPaperworkComponent,
    DocumentsPartOfficeComponent,
    DocumentPartOfficeModalComponent,
  ],
  imports: [
    CommonModule,
    DocumentsPartOfficeRoutingModule,
    SharedModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    DocumentsListComponent,
    NgScrollbarModule,
    TabsModule,
  ],
})
export class DocumentsPartOfficeModule {}
