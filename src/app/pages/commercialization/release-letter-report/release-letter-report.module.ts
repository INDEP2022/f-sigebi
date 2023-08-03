import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FindReleaseLetterComponent } from './find-release-letter/find-release-letter.component';
import { ReleaseLetterReportRoutingModule } from './release-letter-report-routing.module';
import { ReleaseLetterReportComponent } from './release-letter-report.component';
import { CustomDateFilterComponent_ } from './searchDate';

@NgModule({
  declarations: [
    ReleaseLetterReportComponent,
    FindReleaseLetterComponent,
    CustomDateFilterComponent_,
  ],
  imports: [
    CommonModule,
    FormLoaderComponent,
    ReleaseLetterReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class ReleaseLetterReportModule {}
