import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClosureMonthlyComponent } from './closure-monthly/closure-monthly.component';

const routes: Routes = [
  {
    path: '',
    component: ClosureMonthlyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClosureMonthlyRoutingModule {}
