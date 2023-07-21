import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ExpenseConceptsListComponent } from './expense-concepts-list/expense-concepts-list.component';
import { ExpenseConceptsRoutingModule } from './expense-concepts-routing.module';
import { ExpenseConceptsComponent } from './expense-concepts/expense-concepts.component';
import { ParamsConcepsListComponent } from './params-conceps-list/params-conceps-list.component';
//Components

@NgModule({
  declarations: [
    ExpenseConceptsComponent,
    ExpenseConceptsListComponent,
    ParamsConcepsListComponent,
  ],
  imports: [
    CommonModule,
    ExpenseConceptsRoutingModule,
    SharedModule,
    AccordionModule,
  ],
})
export class ExpenseConceptsModule {}
