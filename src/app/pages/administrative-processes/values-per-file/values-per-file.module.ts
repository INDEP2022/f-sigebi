import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { CurrencySharedComponent } from 'src/app/@standalone/shared-forms/currency-shared/currency-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from '../../../shared/shared.module';
import { ValuesPerFileRoutingModule } from './values-per-file-routing.module';
import { ValuesPerFileComponent } from './values-per-file/values-per-file.component';

@NgModule({
  declarations: [ValuesPerFileComponent],
  imports: [
    CommonModule,
    ValuesPerFileRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    BanksSharedComponent,
    CurrencySharedComponent,
    DelegationSharedComponent,
    BsDatepickerModule.forRoot(),
  ],
})
export class ValuesPerFileModule {}
