import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ParameterFormComponent } from './parameter-form/parameter-form.component';
import { ParameterMaintenanceRoutingModule } from './parameter-maintenance-routing.module';
import { ParameterMaintenanceComponent } from './parameter-maintenance/parameter-maintenance.component';
import { CustomDateFilterComponent } from 'src/app/@standalone/shared-forms/filter-date-custom/custom-date-filter';

@NgModule({
  declarations: [ParameterMaintenanceComponent, ParameterFormComponent],
  imports: [CommonModule, ParameterMaintenanceRoutingModule, SharedModule],
})
export class ParameterMaintenanceModule {}
