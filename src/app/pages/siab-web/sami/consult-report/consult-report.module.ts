import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedRequestModule } from 'src/app/pages/request/shared-request/shared-request.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'src/app/utils/file-upload/file-upload.module';
import { ConsultReportRoutingModule } from './consult-report-routing.module';
import { ReportConsolidatedEntryOrderComponent } from './report-consolidated-entry-order/report-consolidated-entry-order.component';
import { ReportDocumentGoodComponent } from './report-document-good/report-document-good.component';
import { ReportDocumentComponent } from './report-document/report-document.component';
import { ReportExpensesForGoodComponent } from './report-expenses-for-good/report-expenses-for-good.component';
import { ReportGoodComponent } from './report-good/report-good.component';
import { UploadImagesComponent } from './upload-images/upload-images.component';
import { UploadZipImagesComponent } from './upload-zip-images/upload-zip-images.component';

@NgModule({
  declarations: [
    ReportExpensesForGoodComponent,
    ReportConsolidatedEntryOrderComponent,
    UploadImagesComponent,
    UploadZipImagesComponent,
    ReportGoodComponent,
    ReportDocumentComponent,
    ReportDocumentGoodComponent,
  ],
  imports: [
    CommonModule,
    ConsultReportRoutingModule,
    TabsModule,
    SharedModule,
    SharedRequestModule,
    FileUploadModule,
    FormLoaderComponent,
  ],
})
export class ConsultReportModule {}
