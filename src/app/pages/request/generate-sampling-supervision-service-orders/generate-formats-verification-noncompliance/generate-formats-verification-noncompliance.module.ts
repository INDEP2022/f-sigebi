import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../../shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { GenerateFormatsVerificationNoncomplianceRoutingComponent } from './generate-formats-verification-noncompliance-routing.component';
import { VerifyResultsComponent } from './verify-results/verify-results.component';

@NgModule({
  declarations: [VerifyResultsComponent],
  imports: [
    CommonModule,
    GenerateFormatsVerificationNoncomplianceRoutingComponent,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedRequestModule,
    TabsModule,
  ],
})
export class GenerateFormatsVerificationNoncomplianceModule {}
