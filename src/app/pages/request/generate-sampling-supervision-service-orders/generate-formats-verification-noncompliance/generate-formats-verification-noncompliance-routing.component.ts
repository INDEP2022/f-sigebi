import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewResultsComponent } from './review-results/review-results.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewResultsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenerateFormatsVerificationNoncomplianceRoutingComponent {}
