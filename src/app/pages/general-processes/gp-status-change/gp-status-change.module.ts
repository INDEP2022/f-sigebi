import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpStatusChangeRoutingModule } from './gp-status-change-routing.module';
import { GpStatusChangeComponent } from './gp-status-change/gp-status-change.component';

@NgModule({
  declarations: [GpStatusChangeComponent],
  imports: [CommonModule, GpStatusChangeRoutingModule, SharedModule],
})
export class GpStatusChangeModule {}
