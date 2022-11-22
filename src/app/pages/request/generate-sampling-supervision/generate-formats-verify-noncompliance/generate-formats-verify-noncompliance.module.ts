import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedComponentGssModule } from '../shared-component-gss/shared-component-gss.module';
import { AnnexJFormComponent } from './annex-j-form/annex-j-form.component';
import { AnnexKFormComponent } from './annex-k-form/annex-k-form.component';
import { GenerateFormatsVerifyNoncomplianceRoutingModule } from './generate-formats-verify-noncompliance-routing.module';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { VerifyNoncomplianceComponent } from './verify-noncompliance/verify-noncompliance.component';

@NgModule({
  declarations: [
    VerifyNoncomplianceComponent,
    AnnexJFormComponent,
    GenerateReportComponent,
    AnnexKFormComponent,
  ],
  imports: [
    CommonModule,
    GenerateFormatsVerifyNoncomplianceRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedComponentGssModule,
    TabsModule,
  ],
  exports: [],
})
export class GenerateFormatsVerifyNoncomplianceModule {}
