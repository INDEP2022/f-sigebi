import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { CCSsMSaleStatusRoutingModule } from './c-c-ss-m-sale-status-routing.module';
//Components
import { CCSsCSaleStatusComponent } from './sale-status/c-c-ss-c-sale-status.component';


@NgModule({
  declarations: [
    CCSsCSaleStatusComponent
  ],
  imports: [
    CommonModule,
    CCSsMSaleStatusRoutingModule,
    SharedModule
  ]
})
export class CCSsMSaleStatusModule { }
