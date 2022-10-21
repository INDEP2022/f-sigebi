import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsComponent } from './contracts/contracts.component';

@NgModule({
  declarations: [ContractsComponent],
  imports: [CommonModule, ContractsRoutingModule, SharedModule],
})
export class ContractsModule {}
