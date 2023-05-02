import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PolicyMaintenanceRoutingModule } from './policy-maintenance-routing.module';
import { PolicyMaintenanceComponent } from './policy-maintenance.component';

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
