import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { SwComerCValidCaptureLineComponent } from './sw-comer-c-valid-capture-line/sw-comer-c-valid-capture-line.component';
import { SwComerMValidCaptureLineRoutingModule } from './sw-comer-m-valid-capture-line-routing.module';

@NgModule({
  declarations: [SwComerCValidCaptureLineComponent],
  imports: [CommonModule, SwComerMValidCaptureLineRoutingModule, SharedModule],
})
export class SwComerMValidCaptureLineModule {}
