import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMBatchParametersListComponent } from './c-m-batch-parameters-list/c-m-batch-parameters-list.component';

const routes: Routes = [
  {
    path: '',
    component: CMBatchParametersListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMBatchParametersRoutingModule {}
