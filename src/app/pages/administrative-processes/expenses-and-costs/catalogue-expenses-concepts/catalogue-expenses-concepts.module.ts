import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { CatalogueExpensesConceptsRoutingModule } from './catalogue-expenses-concepts-routing.module';
import { CatalogueExpensesConceptsComponent } from './catalogue-expenses-concepts/catalogue-expenses-concepts.component';
import { CatalogueExpensesModalComponent } from './catalogue-expenses-modal/catalogue-expenses-modal.component';

@NgModule({
  declarations: [
    CatalogueExpensesConceptsComponent,
    CatalogueExpensesModalComponent,
  ],
  imports: [
    CommonModule,
    CatalogueExpensesConceptsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class CatalogueExpensesConceptsModule {}
