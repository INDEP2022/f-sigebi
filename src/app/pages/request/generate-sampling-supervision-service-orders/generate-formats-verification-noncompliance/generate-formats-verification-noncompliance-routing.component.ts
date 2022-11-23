import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VerifyResultsComponent } from './verify-results/verify-results.component';

const routes: Routes = [
  {
    path: '',
    component: VerifyResultsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateFormatsVerificationNoncomplianceRoutingComponent {}
