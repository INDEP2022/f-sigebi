import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';
import { NumeraryOperatorRoutingModule } from './numerary-operator-routing.module';
import { NumeraryOperatorComponent } from './numerary-operator/numerary-operator.component';

@NgModule({
  declarations: [NumeraryOperatorComponent],
  imports: [
    CommonModule,
    NumeraryOperatorRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class NumeraryOperatorModule {}
