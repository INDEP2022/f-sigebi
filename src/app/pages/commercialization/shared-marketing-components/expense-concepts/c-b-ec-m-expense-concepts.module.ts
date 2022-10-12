import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { CBEcMPaymentsConceptsRoutingModule } from './c-b-ec-m-expense-concepts-routing.module';
//Components
import { CBEclCExpenseConceptsListComponent } from './expense-concepts-list/c-b-ecl-c-expense-concepts-list.component';

@NgModule({
  declarations: [
    CBEclCExpenseConceptsListComponent
  ],
  imports: [
    CommonModule,
    CBEcMPaymentsConceptsRoutingModule,
    SharedModule
  ]
})
export class CBEcMPaymentsConceptsModule { }
