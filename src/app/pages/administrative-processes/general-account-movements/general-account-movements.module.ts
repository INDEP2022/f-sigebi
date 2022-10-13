import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GeneralAccountMovementsRoutingModule } from './general-account-movements-routing.module';
import { GeneralAccountMovementsComponent } from './general-account-movements/general-account-movements.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  declarations: [GeneralAccountMovementsComponent],
  imports: [
    CommonModule,
    GeneralAccountMovementsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class GeneralAccountMovementsModule {}
