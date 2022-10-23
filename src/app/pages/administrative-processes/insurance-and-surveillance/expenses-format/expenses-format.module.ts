import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesFormatRoutingModule } from './expenses-format-routing.module';
import { ExpensesFormatComponent } from './expenses-format/expenses-format.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [ExpensesFormatComponent],
  imports: [CommonModule, ExpensesFormatRoutingModule, SharedModule],
})
export class ExpensesFormatModule {}
