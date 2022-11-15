import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { AdministrativeProcessesRoutingModule } from './administrative-processes-routing.module';
import { AdministrativeProcessesComponent } from './administrative-processes.component';
import { ExpensesAndCostsModule } from './expenses-and-costs/expenses-and-costs.module';
import { InsuranceAndSurveillanceModule } from './insurance-and-surveillance/insurance-and-surveillance.module';
import { NumeraryModule } from './numerary/numerary.module';

@NgModule({
  declarations: [AdministrativeProcessesComponent],
  imports: [
    CommonModule,
    AdministrativeProcessesRoutingModule,
    InsuranceAndSurveillanceModule,
    ExpensesAndCostsModule,
    NumeraryModule,
  ],
})
export class AdministrativeProcessesModule {}
