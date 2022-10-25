import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { ServicesUnitPricesRoutingModule } from './services-unit-prices-routing.module';
import { ServicesUnitPricesComponent } from './services-unit-prices/services-unit-prices.component';

@NgModule({
  declarations: [ServicesUnitPricesComponent],
  imports: [CommonModule, ServicesUnitPricesRoutingModule, SharedModule],
})
export class ServicesUnitPricesModule {}
