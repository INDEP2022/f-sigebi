import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { ExpenseConceptsRoutingModule } from './expense-concepts-routing.module';
//Components
import { ExpenseConceptsListComponent } from './expense-concepts-list/expense-concepts-list.component';

@NgModule({
  declarations: [ExpenseConceptsListComponent],
  imports: [CommonModule, ExpenseConceptsRoutingModule, SharedModule],
})
export class ExpenseConceptsModule {}
