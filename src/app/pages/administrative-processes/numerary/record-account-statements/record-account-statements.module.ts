import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PreviewDocumentsComponent } from 'src/app/@standalone/preview-documents/preview-documents.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RecordAccountStatementsModalComponent } from './record-account-statements-modal/record-account-statements-modal.component';
import { RecordAccountStatementsRoutingModule } from './record-account-statements-routing.module';
import { RecordAccountStatementsComponent } from './record-account-statements/record-account-statements.component';

@NgModule({
  declarations: [
    RecordAccountStatementsComponent,
    RecordAccountStatementsModalComponent,
  ],
  imports: [
    CommonModule,
    RecordAccountStatementsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    TabsModule,
    PreviewDocumentsComponent,
  ],
})
export class RecordAccountStatementsModule {}
