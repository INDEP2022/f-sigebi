import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConciliationExecutionMainComponent } from './conciliation-execution-main/conciliation-execution-main.component';

const routes: Routes = [
  {
    path: ':goodType',
    component: ConciliationExecutionMainComponent,
    data: { screen: 'FCOMER612' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConciliationExecutionRoutingModule {}
