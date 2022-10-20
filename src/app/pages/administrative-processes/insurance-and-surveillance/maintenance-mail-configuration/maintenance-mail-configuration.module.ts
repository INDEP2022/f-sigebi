import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceMailConfigurationRoutingModule } from './maintenance-mail-configuration-routing.module';
import { MaintenanceMailConfigurationComponent } from './maintenance-mail-configuration/maintenance-mail-configuration.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

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
