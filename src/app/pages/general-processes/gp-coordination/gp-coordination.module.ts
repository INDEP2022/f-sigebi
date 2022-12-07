import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpCoordinationRoutingModule } from './gp-coordination-routing.module';
import { GpCoordinationComponent } from './gp-coordination/gp-coordination.component';

@NgModule({
  declarations: [GpCoordinationComponent],
  imports: [CommonModule, GpCoordinationRoutingModule, SharedModule],
})
export class GpCoordinationModule {}
