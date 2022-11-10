import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpCaptureFilterComponent } from '../components/gp-capture-filter/gp-capture-filter.component';
import { GpIConsolidatedRoutingModule } from './gp-i-consolidated-routing.module';
import { GpIConsolidatedComponent } from './gp-i-consolidated/gp-i-consolidated.component';

@NgModule({
  declarations: [GpIConsolidatedComponent],
  imports: [
    CommonModule,
    GpIConsolidatedRoutingModule,
    SharedModule,
    GpCaptureFilterComponent,
  ],
})
export class GpIConsolidatedModule {}
