import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CPMParameterMaintenanceRoutingModule } from './c-p-m-parameter-maintenance-routing.module';
import { CPPmCParameterMaintenanceComponent } from './c-p-pm-c-parameter-maintenance/c-p-pm-c-parameter-maintenance.component';
import { ParameterFormComponent } from './parameter-form/parameter-form.component';

@NgModule({
  declarations: [CPPmCParameterMaintenanceComponent, ParameterFormComponent],
  imports: [CommonModule, CPMParameterMaintenanceRoutingModule, SharedModule],
})
export class CPMParameterMaintenanceModule {}
