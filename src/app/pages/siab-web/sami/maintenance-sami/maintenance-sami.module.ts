import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { AclarationTableComponent } from './maintenance-aclaration/aclaration-table/aclaration-table.component';
import { MaintenanceAclarationComponent } from './maintenance-aclaration/maintenance-aclaration.component';
import { DelegationTableComponent } from './maintenance-delegation/delegation-table/delegation-table.component';
import { MaintenanceDelegationComponent } from './maintenance-delegation/maintenance-delegation.component';
import { FractionTableComponent } from './maintenance-fraction/fraction-table/fraction-table.component';
import { MaintenanceFractionComponent } from './maintenance-fraction/maintenance-fraction.component';
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
    MaintenanceFractionComponent,
    FractionTableComponent,
    MaintenanceDelegationComponent,
    DelegationTableComponent,
    MaintenanceAclarationComponent,
    AclarationTableComponent,
  ],
})
export class MaintenanceSamiModule {}
