import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GpCaptureFilterComponent } from '../components/gp-capture-filter/gp-capture-filter.component';
import { GpICaptureDigitalizationRoutingModule } from './gp-i-capture-digitalization-routing.module';
import { GpICaptureDigitalizationComponent } from './gp-i-capture-digitalization/gp-i-capture-digitalization.component';

@NgModule({
  declarations: [GpICaptureDigitalizationComponent],
  imports: [
    CommonModule,
    GpICaptureDigitalizationRoutingModule,
    SharedModule,
    GpCaptureFilterComponent,
  ],
})
export class GpICaptureDigitalizationModule {}
