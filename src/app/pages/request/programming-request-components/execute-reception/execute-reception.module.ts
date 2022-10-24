import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { AssignReceiptFormComponent } from './assign-receipt-form/assign-receipt-form.component';
import { DocumentFormComponent } from './document-form/document-form.component';
import { DocumentShowComponent } from './document-show/document-show.component';
import { DocumentsListComponent } from './documents-list/documents-list.component';
import { ExecuteReceptionFormComponent } from './execute-reception-form/execute-reception-form.component';
import { ExecuteReceptionRoutingModule } from './execute-reception-routing.module';
import { GenerateReceiptFormComponent } from './generate-receipt-form/generate-receipt-form.component';
import { PhotographyFormComponent } from './photography-form/photography-form.component';
import { ReschedulingFormComponent } from './rescheduling-form/rescheduling-form.component';
import { WitnessFormComponent } from './witness-form/witness-form.component';

@NgModule({
  declarations: [
    ExecuteReceptionFormComponent,
    DocumentsListComponent,
    DocumentFormComponent,
    DocumentShowComponent,
    GenerateReceiptFormComponent,
    WitnessFormComponent,
    PhotographyFormComponent,
    AssignReceiptFormComponent,
    ReschedulingFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    TabsModule,
    ExecuteReceptionRoutingModule,
    ModalModule.forChild(),
  ],
})
export class ExecuteReceptionModule {}
