import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMValuesComponent } from './c-p-m-values/c-p-m-values.component';

const routes: Routes = [
  {
    path: '', component: CPMValuesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CPMValuesRoutingModule { }
