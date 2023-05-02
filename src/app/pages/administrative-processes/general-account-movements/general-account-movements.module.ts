import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../../../shared/shared.module';
import { GeneralAccountMovementsRoutingModule } from './general-account-movements-routing.module';
import { GeneralAccountMovementsComponent } from './general-account-movements/general-account-movements.component';

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
