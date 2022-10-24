import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CentralizedExpensesRoutingModule } from './centralized-expenses-routing.module';
import { CentralizedExpensesComponent } from './centralized-expenses/centralized-expenses.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CentralizedExpensesComponent],
  imports: [
    CommonModule,
    CentralizedExpensesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class CentralizedExpensesModule {}
