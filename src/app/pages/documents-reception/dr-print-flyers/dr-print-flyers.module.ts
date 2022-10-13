import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrPrintFlyersRoutingModule } from './dr-print-flyers-routing.module';
import { DrPrintFlyersComponent } from './dr-print-flyers/dr-print-flyers.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';

@NgModule({
  declarations: [DrPrintFlyersComponent],
  imports: [
    CommonModule,
    DrPrintFlyersRoutingModule,
    SharedModule,
    DelegationSharedComponent,
  ],
})
export class DrPrintFlyersModule {}
