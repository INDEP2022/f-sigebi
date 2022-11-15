import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpImageDebuggingRoutingModule } from './gp-image-debugging-routing.module';
import { GpImageDebuggingComponent } from './gp-image-debugging/gp-image-debugging.component';

@NgModule({
  declarations: [GpImageDebuggingComponent],
  imports: [CommonModule, GpImageDebuggingRoutingModule, SharedModule],
})
export class GpImageDebuggingModule {}
