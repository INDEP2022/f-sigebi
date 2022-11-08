import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpIManagementStrategiesRoutingModule } from './gp-i-management-strategies-routing.module';
import { GpIManagementStrategiesComponent } from './gp-i-management-strategies/gp-i-management-strategies.component';

@NgModule({
  declarations: [GpIManagementStrategiesComponent],
  imports: [CommonModule, GpIManagementStrategiesRoutingModule, SharedModule],
})
export class GpIManagementStrategiesModule {}
