import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrativeProcessesRoutingModule } from './administrative-processes-routing.module';
import { AdministrativeProcessesComponent } from './administrative-processes.component';

@NgModule({
  declarations: [AdministrativeProcessesComponent],
  imports: [CommonModule, AdministrativeProcessesRoutingModule],
})
export class AdministrativeProcessesModule {}
