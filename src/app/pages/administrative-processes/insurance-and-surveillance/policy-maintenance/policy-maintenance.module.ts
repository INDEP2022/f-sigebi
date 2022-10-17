import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolicyMaintenanceRoutingModule } from './policy-maintenance-routing.module';
import { PolicyMaintenanceComponent } from './policy-maintenance.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [PolicyMaintenanceComponent],
  imports: [
    CommonModule,
    PolicyMaintenanceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class PolicyMaintenanceModule {}
