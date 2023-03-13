import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceiveValidationOfEyeVisitResultComponent } from './receive-validation-of-eye-visit-result/receive-validation-of-eye-visit-result.component';

const routes: Routes = [
  {
    path: '',
    component: ReceiveValidationOfEyeVisitResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceiveValidationOfEyeVisitResultRoutingModule {}
