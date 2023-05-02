import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { MaintenanceMailConfigurationRoutingModule } from './maintenance-mail-configuration-routing.module';
import { MaintenanceMailConfigurationComponent } from './maintenance-mail-configuration/maintenance-mail-configuration.component';

@NgModule({
  declarations: [MaintenanceMailConfigurationComponent],
  imports: [
    CommonModule,
    MaintenanceMailConfigurationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class MaintenanceMailConfigurationModule {}
