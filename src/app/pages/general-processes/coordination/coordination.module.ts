import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CoordinationRoutingModule } from './coordination-routing.module';
import { CoordinationComponent } from './coordination/coordination.component';

@NgModule({
  declarations: [CoordinationComponent],
  imports: [CommonModule, CoordinationRoutingModule, SharedModule],
})
export class CoordinationModule {}
