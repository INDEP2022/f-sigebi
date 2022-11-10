import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCBankConceptsModalComponent } from './c-p-c-bank-concepts-modal/c-p-c-bank-concepts-modal.component';
import { CPCBankConceptsComponent } from './c-p-c-bank-concepts/c-p-c-bank-concepts.component';
import { CPMBankConceptsRoutingModule } from './c-p-m-bank-concepts-routing.module';

@NgModule({
  declarations: [CPCBankConceptsComponent, CPCBankConceptsModalComponent],
  imports: [
    CommonModule,
    CPMBankConceptsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMBankConceptsModule {}
