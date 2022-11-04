import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../../../shared/shared.module';
import { ExpensesFormatRoutingModule } from './expenses-format-routing.module';
import { ExpensesFormatComponent } from './expenses-format/expenses-format.component';

@NgModule({
  declarations: [ExpensesFormatComponent],
  imports: [CommonModule, ExpensesFormatRoutingModule, SharedModule],
})
export class ExpensesFormatModule {}
