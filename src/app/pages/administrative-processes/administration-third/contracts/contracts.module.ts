import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractsRoutingModule } from './contracts-routing.module';
import { ContractsComponent } from './contracts/contracts.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ContractsComponent
  ],
  imports: [
    CommonModule,
    ContractsRoutingModule,
    SharedModule,
  ]
})
export class ContractsModule { }
