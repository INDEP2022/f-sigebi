import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';
import { ApplyLifRoutingModule } from './apply-lif-routing.module';
import { ApplyLifComponent } from './apply-lif/apply-lif.component';

@NgModule({
  declarations: [ApplyLifComponent],
  imports: [
    CommonModule,
    ApplyLifRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class ApplyLifModule {}
