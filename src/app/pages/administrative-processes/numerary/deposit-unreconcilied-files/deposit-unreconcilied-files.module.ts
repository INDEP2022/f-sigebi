import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { DepositUnreconciliedFilesRoutingModule } from './deposit-unreconcilied-files-routing.module';
import { DepositUnreconciliedFilesComponent } from './deposit-unreconcilied-files/deposit-unreconcilied-files.component';

@NgModule({
  declarations: [DepositUnreconciliedFilesComponent],
  imports: [
    CommonModule,
    DepositUnreconciliedFilesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class DepositUnreconciliedFilesModule {}
