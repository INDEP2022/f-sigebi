import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMMaximumTimesComponent } from './c-p-m-maximum-times/c-p-m-maximum-times.component';

const routes: Routes = [
  {
    path: '',
    component: CPMMaximumTimesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMMaximumTimesRoutingModule {}
