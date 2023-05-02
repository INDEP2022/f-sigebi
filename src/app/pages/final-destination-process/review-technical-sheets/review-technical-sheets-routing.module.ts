import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewTechnicalSheetsComponent } from './review-technical-sheets/review-technical-sheets.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewTechnicalSheetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewTechnicalSheetsRoutingModule {}
