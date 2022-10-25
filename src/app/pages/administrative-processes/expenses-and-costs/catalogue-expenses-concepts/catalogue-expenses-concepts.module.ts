import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatalogueExpensesConceptsRoutingModule } from './catalogue-expenses-concepts-routing.module';
import { CatalogueExpensesConceptsComponent } from './catalogue-expenses-concepts/catalogue-expenses-concepts.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CatalogueExpensesConceptsComponent],
  imports: [
    CommonModule,
    CatalogueExpensesConceptsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class CatalogueExpensesConceptsModule {}
