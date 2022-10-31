import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpRftMReviewTechnicalSheetsRoutingModule } from './fdp-rft-m-review-technical-sheets-routing.module';
import { FdpRftCReviewTechnicalSheetsComponent } from './review-technical-sheets/fdp-rft-c-review-technical-sheets.component';

@NgModule({
  declarations: [FdpRftCReviewTechnicalSheetsComponent],
  imports: [
    CommonModule,
    FdpRftMReviewTechnicalSheetsRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class FdpRftMReviewTechnicalSheetsModule {}
