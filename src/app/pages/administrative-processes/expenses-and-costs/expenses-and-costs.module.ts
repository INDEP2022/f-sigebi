import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExpensesAndCostsRoutingModule } from './expenses-and-costs-routing.module';
import { ExpensesAndCostsComponent } from './expenses-and-costs.component';

@NgModule({
  declarations: [ExpensesAndCostsComponent],
  imports: [CommonModule, ExpensesAndCostsRoutingModule],
})
export class ExpensesAndCostsModule {}
