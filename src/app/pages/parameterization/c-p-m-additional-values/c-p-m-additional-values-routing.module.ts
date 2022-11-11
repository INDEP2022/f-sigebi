import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPMAdditionalValuesComponent } from './c-p-m-additional-values/c-p-m-additional-values.component';

const routes: Routes = [
  {
    path: '',
    component: CPMAdditionalValuesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMAdditionalValuesRoutingModule {}
