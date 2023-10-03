import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { CentralizedExpensesModalComponent } from './centralized-expenses-modal/centralized-expenses.modal.component';
import { CentralizedExpensesRoutingModule } from './centralized-expenses-routing.module';
import { CentralizedExpensesComponent } from './centralized-expenses/centralized-expenses.component';

@NgModule({
  declarations: [
    CentralizedExpensesComponent,
    CentralizedExpensesModalComponent,
  ],
  imports: [
    CommonModule,
    CentralizedExpensesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class CentralizedExpensesModule {}
