import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ManagementStrategiesRoutingModule } from './management-strategies-routing.module';
import { ManagementStrategiesComponent } from './management-strategies/management-strategies.component';

@NgModule({
  declarations: [ManagementStrategiesComponent],
  imports: [CommonModule, ManagementStrategiesRoutingModule, SharedModule],
})
export class ManagementStrategiesModule {}
