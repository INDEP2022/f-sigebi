import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrGoodsForecastRoutingModule } from './dr-goods-forecast-routing.module';
import { DrGoodsForecastComponent } from './dr-goods-forecast/dr-goods-forecast.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DrGoodsForecastComponent],
  imports: [CommonModule, DrGoodsForecastRoutingModule, SharedModule],
})
export class DrGoodsForecastModule {}
