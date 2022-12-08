import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CaptureFilterComponent } from '../components/capture-filter/capture-filter.component';
import { CaptureDigitalizationRoutingModule } from './capture-digitalization-routing.module';
import { CaptureDigitalizationComponent } from './capture-digitalization/capture-digitalization.component';

@NgModule({
  declarations: [CaptureDigitalizationComponent],
  imports: [
    CommonModule,
    CaptureDigitalizationRoutingModule,
    SharedModule,
    CaptureFilterComponent,
  ],
})
export class CaptureDigitalizationModule {}
