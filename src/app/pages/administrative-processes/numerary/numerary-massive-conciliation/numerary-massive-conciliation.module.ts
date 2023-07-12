import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { NumeraryMassiveConciliationRoutingModule } from './numerary-massive-conciliation-routing.module';
import { NumeraryMassiveConciliationComponent } from './numerary-massive-conciliation/numerary-massive-conciliation.component';

@NgModule({
  declarations: [NumeraryMassiveConciliationComponent],
  imports: [
    CommonModule,
    NumeraryMassiveConciliationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class NumeraryMassiveConciliationModule {}
