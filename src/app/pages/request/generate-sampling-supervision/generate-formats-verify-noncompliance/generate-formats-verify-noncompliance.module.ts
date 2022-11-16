import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { AnnexJFormComponent } from './annex-j-form/annex-j-form.component';
import { AssetsTabComponent } from './assets-tab/assets-tab.component';
import { DeductivesComponent } from './deductives/deductives.component';
import { GenerateFormatsVerifyNoncomplianceRoutingModule } from './generate-formats-verify-noncompliance-routing.module';
import { GenerateReportComponent } from './generate-report/generate-report.component';
import { SamplingDetailComponent } from './sampling-detail/sampling-detail.component';
import { VerificationsComponent } from './verifications/verifications.component';
import { VerifyNoncomplianceComponent } from './verify-noncompliance/verify-noncompliance.component';

@NgModule({
  declarations: [
    VerifyNoncomplianceComponent,
    SamplingDetailComponent,
    AssetsTabComponent,
    VerificationsComponent,
    DeductivesComponent,
    AnnexJFormComponent,
    GenerateReportComponent,
  ],
  imports: [
    CommonModule,
    GenerateFormatsVerifyNoncomplianceRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    TabsModule,
  ],
})
export class GenerateFormatsVerifyNoncomplianceModule {}
