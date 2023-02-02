import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { validCaptureLineRoutingModule } from './valid-capture-line-routing.module';
import { validCaptureLineComponent } from './valid-capture-line/valid-capture-line.component';

@NgModule({
  declarations: [validCaptureLineComponent],
  imports: [CommonModule, validCaptureLineRoutingModule, SharedModule],
})
export class validCaptureLineModule {}
