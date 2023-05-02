import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NonWorkingDaysComponent } from './non-working-days/non-working-days.component';

const routes: Routes = [
  {
    path: '',
    component: NonWorkingDaysComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NonWorkingDaysRoutingModule {}
