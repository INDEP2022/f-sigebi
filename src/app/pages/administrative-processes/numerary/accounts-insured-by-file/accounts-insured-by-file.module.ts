import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { AccountsInsuredByFileRoutingModule } from './accounts-insured-by-file-routing.module';
import { AccountsInsuredByFileComponent } from './accounts-insured-by-file/accounts-insured-by-file.component';

@NgModule({
  declarations: [AccountsInsuredByFileComponent],
  imports: [
    CommonModule,
    AccountsInsuredByFileRoutingModule,
    ReactiveFormsModule,
    SharedModule,
  ],
})
export class AccountsInsuredByFileModule {}
