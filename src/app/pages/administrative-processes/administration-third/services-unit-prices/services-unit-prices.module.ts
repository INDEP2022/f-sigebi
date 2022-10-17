import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesUnitPricesRoutingModule } from './services-unit-prices-routing.module';
import { ServicesUnitPricesComponent } from './services-unit-prices/services-unit-prices.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    ServicesUnitPricesComponent
  ],
  imports: [
    CommonModule,
    ServicesUnitPricesRoutingModule,
    SharedModule
  ]
})
export class ServicesUnitPricesModule { }
