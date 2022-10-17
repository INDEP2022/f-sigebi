import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrativeProcessesRoutingModule } from './administrative-processes-routing.module';
import { AdministrativeProcessesComponent } from './administrative-processes.component';
import { InsuranceAndSurveillanceModule } from './insurance-and-surveillance/insurance-and-surveillance.module';

@NgModule({
  declarations: [AdministrativeProcessesComponent],
  imports: [
    CommonModule,
    AdministrativeProcessesRoutingModule,
    InsuranceAndSurveillanceModule,
  ],
})
export class AdministrativeProcessesModule {}
