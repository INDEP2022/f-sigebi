import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '../../../../shared/shared.module';
import { MovementsConsultsComponent } from './movements-consults/movements-consults.component';
import { MovementsGoodsSurveillanceRoutingModule } from './movements-goods-surveillance-routing.module';
import { MovementsGoodsSurveillanceComponent } from './movements-goods-surveillance/movements-goods-surveillance.component';
import { MovementsMovementsComponent } from './movements-movements/movements-movements.component';

@NgModule({
  declarations: [
    MovementsGoodsSurveillanceComponent,
    MovementsConsultsComponent,
    MovementsMovementsComponent,
  ],
  imports: [
    CommonModule,
    MovementsGoodsSurveillanceRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TabsModule,
  ],
})
export class MovementsGoodsSurveillanceModule {}
