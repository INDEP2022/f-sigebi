import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuestionCatalogComponent } from './question-catalog/question-catalog.component';

const routes: Routes = [
  {
    path: '',
    component: QuestionCatalogComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionCatalogRoutingModule {}
