import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportConsolidatedEntryOrderComponent } from './report-consolidated-entry-order/report-consolidated-entry-order.component';
import { ReportDocumentGoodComponent } from './report-document-good/report-document-good.component';
import { ReportDocumentScheduleComponent } from './report-document-schedule/report-document-schedule.component';
import { ReportDocumentComponent } from './report-document/report-document.component';
import { ReportExpensesForGoodComponent } from './report-expenses-for-good/report-expenses-for-good.component';
import { ReportGoodComponent } from './report-good/report-good.component';
import { UploadImagesComponent } from './upload-images/upload-images.component';

const routes: Routes = [
  {
    path: 'report-expenses-for-good',
    component: ReportExpensesForGoodComponent,
  },
  {
    path: 'report-consolidated-entry-order',
    component: ReportConsolidatedEntryOrderComponent,
  },
  {
    path: 'upload-images',
    component: UploadImagesComponent,
  },

  {
    path: 'report-goods',
    component: ReportGoodComponent,
  },
  {
    path: 'report-documents',
    component: ReportDocumentComponent,
  },
  {
    path: 'report-documents-goods',
    component: ReportDocumentGoodComponent,
  },
  {
    path: 'report-documents-schedule',
    component: ReportDocumentScheduleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ConsultReportRoutingModule {}
