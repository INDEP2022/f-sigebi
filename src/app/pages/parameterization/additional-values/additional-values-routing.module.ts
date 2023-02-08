import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdditionalValuesComponent } from './additional-values/additional-values.component';

const routes: Routes = [
  {
    path: '',
    component: AdditionalValuesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdditionalValuesRoutingModule {}
