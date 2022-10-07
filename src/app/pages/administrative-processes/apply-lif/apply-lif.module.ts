import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplyLifRoutingModule } from './apply-lif-routing.module';
import { ApplyLifComponent } from './apply-lif/apply-lif.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
