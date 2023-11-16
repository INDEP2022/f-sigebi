import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedRequestModule } from 'src/app/pages/request/shared-request/shared-request.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { FileUploadModule } from 'src/app/utils/file-upload/file-upload.module';
import { ConsultReportRoutingModule } from './consult-report-routing.module';
import { ReportConsolidatedEntryOrderComponent } from './report-consolidated-entry-order/report-consolidated-entry-order.component';
import { ReportExpensesForGoodComponent } from './report-expenses-for-good/report-expenses-for-good.component';
import { UploadImagesComponent } from './upload-images/upload-images.component';
import { UploadZipImagesComponent } from './upload-zip-images/upload-zip-images.component';
@NgModule({
  declarations: [
    ReportExpensesForGoodComponent,
    ReportConsolidatedEntryOrderComponent,
    UploadImagesComponent,
    UploadZipImagesComponent,
  ],
  imports: [
    CommonModule,
    ConsultReportRoutingModule,
    TabsModule,
    SharedModule,
    SharedRequestModule,
    FileUploadModule,
  ],
})
export class ConsultReportModule {}
