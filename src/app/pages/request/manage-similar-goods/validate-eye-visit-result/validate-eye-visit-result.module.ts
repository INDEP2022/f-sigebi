import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { ValidateEyeVisitResultRoutingModule } from './validate-eye-visit-result-routing.module';
import { ValidateEyeVisitResultComponent } from './validate-eye-visit-result/validate-eye-visit-result.component';

@NgModule({
  declarations: [ValidateEyeVisitResultComponent],
  imports: [
    CommonModule,
    ValidateEyeVisitResultRoutingModule,
    SharedRequestModule,
  ],
})
export class ValidateEyeVisitResultModule {}
