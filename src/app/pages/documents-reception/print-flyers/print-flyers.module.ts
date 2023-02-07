import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DepartmentsSharedComponent } from 'src/app/@standalone/shared-forms/departments-shared/departments-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PrintFlyersRoutingModule } from './print-flyers-routing.module';
import { PrintFlyersComponent } from './print-flyers/print-flyers.component';

@NgModule({
  declarations: [PrintFlyersComponent],
  imports: [
    CommonModule,
    PrintFlyersRoutingModule,
    SharedModule,
    DelegationSharedComponent,
    DepartmentsSharedComponent,
  ],
})
export class PrintFlyersModule {}
