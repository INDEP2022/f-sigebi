import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DrGoodsForecastRoutingModule } from './dr-goods-forecast-routing.module';
import { DrGoodsForecastComponent } from './dr-goods-forecast/dr-goods-forecast.component';

@NgModule({
  declarations: [DrGoodsForecastComponent],
  imports: [CommonModule, DrGoodsForecastRoutingModule, SharedModule],
})
export class DrGoodsForecastModule {}
