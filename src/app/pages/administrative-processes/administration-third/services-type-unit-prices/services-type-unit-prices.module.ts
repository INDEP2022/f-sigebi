import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { ServicesTypeUnitPricesFormComponent } from './services-type-unit-prices-form/services-type-unit-prices-form.component';
import { ServicesTypeUnitPricesComponent } from './services-type-unit-prices/services-type-unit-prices.component';
import { ServicesTypeUnitRoutingModule } from './services-type-unit-routing.module';

@NgModule({
  declarations: [
    ServicesTypeUnitPricesComponent,
    ServicesTypeUnitPricesFormComponent,
  ],
  imports: [CommonModule, ServicesTypeUnitRoutingModule, SharedModule],
})
export class ServicesTypeUnitPricesModule {}
