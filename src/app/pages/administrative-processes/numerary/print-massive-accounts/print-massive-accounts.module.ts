import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { DateInitialFinishComponent } from 'src/app/@standalone/shared-forms/date-initial-finish/date-initial-finish.component';
import { SharedModule } from '../../../../shared/shared.module';
import { PrintMassiveAccountComponent } from './print-massive-account/print-massive-account.component';
import { PrintMassiveAccountsRoutingModule } from './print-massive-accounts-routing.module';

@NgModule({
  declarations: [PrintMassiveAccountComponent],
  imports: [
    CommonModule,
    PrintMassiveAccountsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    DateInitialFinishComponent,
  ],
})
export class PrintMassiveAccountsModule {}
