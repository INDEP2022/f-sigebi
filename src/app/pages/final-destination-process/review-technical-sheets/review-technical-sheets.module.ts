import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReviewTechnicalSheetsRoutingModule } from './review-technical-sheets-routing.module';
import { ReviewTechnicalSheetsComponent } from './review-technical-sheets/review-technical-sheets.component';

@NgModule({
  declarations: [ReviewTechnicalSheetsComponent],
  imports: [
    CommonModule,
    ReviewTechnicalSheetsRoutingModule,
    SharedModule,
    NgScrollbarModule,
  ],
})
export class ReviewTechnicalSheetsModule {}
