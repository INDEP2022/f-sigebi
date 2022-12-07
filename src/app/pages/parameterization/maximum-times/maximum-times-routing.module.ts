import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaximumTimesComponent } from './maximum-times/maximum-times.component';

const routes: Routes = [
  {
    path: '',
    component: MaximumTimesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MaximumTimesRoutingModule {}
