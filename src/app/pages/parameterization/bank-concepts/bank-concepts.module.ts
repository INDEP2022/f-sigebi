import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { BankConceptsModalComponent } from './bank-concepts-modal/bank-concepts-modal.component';
import { BankConceptsRoutingModule } from './bank-concepts-routing.module';
import { BankConceptsComponent } from './bank-concepts/bank-concepts.component';

@NgModule({
  declarations: [BankConceptsComponent, BankConceptsModalComponent],
  imports: [
    CommonModule,
    BankConceptsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class BankConceptsModule {}
