import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NumeraryOperatorRoutingModule } from './numerary-operator-routing.module';
import { NumeraryOperatorComponent } from './numerary-operator/numerary-operator.component';
import { SharedModule } from '../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
