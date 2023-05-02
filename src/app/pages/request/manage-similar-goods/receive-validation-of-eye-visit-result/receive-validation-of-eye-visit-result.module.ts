import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { ReceiveValidationOfEyeVisitResultRoutingModule } from './receive-validation-of-eye-visit-result-routing.module';
import { ReceiveValidationOfEyeVisitResultComponent } from './receive-validation-of-eye-visit-result/receive-validation-of-eye-visit-result.component';

@NgModule({
  declarations: [ReceiveValidationOfEyeVisitResultComponent],
  imports: [
    CommonModule,
    ReceiveValidationOfEyeVisitResultRoutingModule,
    SharedRequestModule,
  ],
})
export class ReceiveValidationOfEyeVisitResultModule {}
