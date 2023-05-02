import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { CompensationActMainComponent } from './compensation-act-main/compensation-act-main.component';
import { CompensationActRoutingModule } from './compensation-act-routing.module';

@NgModule({
  declarations: [CompensationActMainComponent],
  imports: [
    CommonModule,
    CompensationActRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class CompensationActModule {}
