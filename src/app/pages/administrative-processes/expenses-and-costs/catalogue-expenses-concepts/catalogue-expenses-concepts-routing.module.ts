import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogueExpensesConceptsComponent } from './catalogue-expenses-concepts/catalogue-expenses-concepts.component';

const routes: Routes = [
  {
    path: '',
    component: CatalogueExpensesConceptsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogueExpensesConceptsRoutingModule {}
