import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DrPrintFlyersRoutingModule } from './dr-print-flyers-routing.module';
import { DrPrintFlyersComponent } from './dr-print-flyers/dr-print-flyers.component';


@NgModule({
  declarations: [
    DrPrintFlyersComponent
  ],
  imports: [
    CommonModule,
    DrPrintFlyersRoutingModule
  ]
})
export class DrPrintFlyersModule { }
