import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMNonWorkingDaysComponent } from './c-p-m-non-working-days/c-p-m-non-working-days.component';

const routes: Routes = [
  {
    path: '', component: CPMNonWorkingDaysComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CPMNonWorkingDaysRoutingModule { }
