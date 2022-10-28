import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { ExpensesConceptsRoutingModule } from './expenses-concepts-routing.module';
import { ExpensesConceptsComponent } from './expenses-concepts/expenses-concepts.component';

@NgModule({
  declarations: [ExpensesConceptsComponent],
  imports: [
    CommonModule,
    ExpensesConceptsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class ExpensesConceptsModule {}
