import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ParagraphsListComponent } from './paragraphs-list/paragraphs-list.component';

const routes: Routes = [
  {
    path: '',
    component: ParagraphsListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ParagraphsRoutingModule {}
