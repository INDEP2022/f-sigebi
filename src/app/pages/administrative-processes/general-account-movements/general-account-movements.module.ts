import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
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
    BanksSharedComponent,
    BsDatepickerModule.forRoot(),
  ],
})
export class GeneralAccountMovementsModule {}
