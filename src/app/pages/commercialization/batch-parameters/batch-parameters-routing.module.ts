import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BatchParametersListComponent } from './batch-parameters-list/batch-parameters-list.component';

const routes: Routes = [
  {
    path: '',
    component: BatchParametersListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BatchParametersRoutingModule {}
