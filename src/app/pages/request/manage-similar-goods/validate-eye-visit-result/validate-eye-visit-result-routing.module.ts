import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateEyeVisitResultComponent } from './validate-eye-visit-result/validate-eye-visit-result.component';

const routes: Routes = [
  {
    path: '',
    component: ValidateEyeVisitResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateEyeVisitResultRoutingModule {}
