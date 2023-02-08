import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicResourcesMainComponent } from './economic-resources-main/economic-resources-main.component';
import { EconomicResourcesRoutingModule } from './economic-resources-routing.module';

@NgModule({
  declarations: [EconomicResourcesMainComponent],
  imports: [
    CommonModule,
    EconomicResourcesRoutingModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class EconomicResourcesModule {}
