import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceOpinionRoutingModule } from './maintenance-opinion-routing.module';
import { MaintenanceOpinionComponent } from './maintenance-opinion/maintenance-opinion.component';

@NgModule({
  declarations: [MaintenanceOpinionComponent],
  imports: [CommonModule, MaintenanceOpinionRoutingModule, SharedModule],
})
export class MaintenanceOpinionModule {}
