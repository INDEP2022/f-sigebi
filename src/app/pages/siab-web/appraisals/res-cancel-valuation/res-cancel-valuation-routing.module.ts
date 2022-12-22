import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { resCancelValuationComponent } from './res-cancel-valuation/res-cancel-valuation.component';

const routes: Routes = [
  {
    path: '',
    component: resCancelValuationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class resCancelValuationRoutingModule {}
