import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyNoncomplianceComponent } from './verify-noncompliance/verify-noncompliance.component';

const routes: Routes = [
  {
    path: '',
    component: VerifyNoncomplianceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateFormatsVerifyNoncomplianceRoutingModule {}
