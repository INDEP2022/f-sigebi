import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TextAreaRenderComponent } from 'src/app/shared/render-components/text-area-render/text-area-render.component';
import { CopyParametersConceptsModalComponent } from './expense-concepts-list/copy-parameters-modal/copy-parameters-modal.component';
import { ExpenseConceptsListModalComponent } from './expense-concepts-list/expense-concepts-list-modal/expense-concepts-list-modal.component';
import { ExpenseConceptsListComponent } from './expense-concepts-list/expense-concepts-list.component';
import { ExpenseConceptsRoutingModule } from './expense-concepts-routing.module';
import { ExpenseConceptsComponent } from './expense-concepts/expense-concepts.component';
import { ParamsConcepsListComponent } from './params-conceps-list/params-conceps-list.component';
import { ParamsConceptsModalComponent } from './params-conceps-list/params-concepts-modal/params-concepts-modal.component';

//Components

@NgModule({
  declarations: [
    ExpenseConceptsComponent,
    ExpenseConceptsListComponent,
    ParamsConcepsListComponent,
    ParamsConceptsModalComponent,
    CopyParametersConceptsModalComponent,
    ExpenseConceptsListModalComponent,
  ],
  imports: [
    CommonModule,
    ExpenseConceptsRoutingModule,
    SharedModule,
    AccordionModule,
    TextAreaRenderComponent,
  ],
  exports: [ParamsConcepsListComponent],
})
export class ExpenseConceptsModule {}
