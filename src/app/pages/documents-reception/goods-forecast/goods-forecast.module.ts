import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsForecastRoutingModule } from './goods-forecast-routing.module';
import { GoodsForecastComponent } from './goods-forecast/goods-forecast.component';

@NgModule({
  declarations: [GoodsForecastComponent],
  imports: [CommonModule, GoodsForecastRoutingModule, SharedModule],
})
export class GoodsForecastModule {}
