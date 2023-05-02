import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DocCompensationSatListComponent } from './doc-compensation-sat-list/doc-compensation-sat-list.component';

const routes: Routes = [
  {
    path: '',
    component: DocCompensationSatListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DocCompensationSatRoutingModule {}
