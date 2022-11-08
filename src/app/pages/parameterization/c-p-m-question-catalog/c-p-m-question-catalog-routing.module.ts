import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCQuestionCatalogComponent } from './c-p-c-question-catalog/c-p-c-question-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: CPCQuestionCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMQuestionCatalogRoutingModule {}
