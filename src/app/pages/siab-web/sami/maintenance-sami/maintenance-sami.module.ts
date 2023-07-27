import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { MaintenanceGoodsComponent } from './maintenance-goods/maintenance-goods.component';
import { MaintenanceProgramingsComponent } from './maintenance-programings/maintenance-programings.component';
import { MaintenanceSamiComponent } from './maintenance-sami.component';
import { MaintenanceSamiRoutingModule } from './maintenance-sami.routing.module';

@NgModule({
  imports: [
    CommonModule,
    TabsModule,
    SharedModule,
    MaintenanceSamiRoutingModule,
  ],
  declarations: [
    MaintenanceSamiComponent,
    MaintenanceGoodsComponent,
    MaintenanceProgramingsComponent,
  ],
})
export class MaintenanceSamiModule {}
