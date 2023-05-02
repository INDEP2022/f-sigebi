import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { InsuranceAndSurveillanceRoutingModule } from './insurance-and-surveillance-routing.module';
import { InsuranceAndSurveillanceComponent } from './insurance-and-surveillance.component';
@NgModule({
  declarations: [InsuranceAndSurveillanceComponent],
  imports: [CommonModule, InsuranceAndSurveillanceRoutingModule],
})
export class InsuranceAndSurveillanceModule {}
