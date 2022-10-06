import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocCompensationListComponent } from './doc-compensation-list/doc-compensation-list.component';

const routes: Routes = [
  {
    path: '',
    component: DocCompensationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocCompensationRoutingModule {}
