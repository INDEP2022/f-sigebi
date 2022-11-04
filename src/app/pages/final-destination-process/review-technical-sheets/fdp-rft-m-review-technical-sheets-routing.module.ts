import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FdpRftCReviewTechnicalSheetsComponent } from './review-technical-sheets/fdp-rft-c-review-technical-sheets.component';

const routes: Routes = [
  {
    path: '',
    component: FdpRftCReviewTechnicalSheetsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FdpRftMReviewTechnicalSheetsRoutingModule {}
