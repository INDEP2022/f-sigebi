import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormalizeProgrammingFormComponent } from './formalize-programming-form/formalize-programming-form.component';
import { FormalizeProgrammingRoutingModule } from './formalize-programming-routing.module';
import { InformationRecordComponent } from './information-record/information-record.component';
import { PrintReportModalComponent } from './print-report-modal/print-report-modal.component';
import { ShowProceedingCloseComponent } from './show-proceeding-close/show-proceeding-close.component';
@NgModule({
  declarations: [
    FormalizeProgrammingFormComponent,
    InformationRecordComponent,
    PrintReportModalComponent,
    ShowProceedingCloseComponent,
  ],
  imports: [
    CommonModule,
    TabsModule,
    FormalizeProgrammingRoutingModule,
    SharedModule,
    ModalModule.forRoot(),
    FormLoaderComponent,
    PdfViewerModule,
  ],
})
export class FormalizeProgrammingModule {}
