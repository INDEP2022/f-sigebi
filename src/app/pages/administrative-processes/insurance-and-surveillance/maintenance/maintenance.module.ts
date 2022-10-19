import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { SharedModule } from '../../../../shared/shared.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { DeletePeriodComponent } from './delete-period/delete-period.component';
import { ChangePeriodComponent } from './change-period/change-period.component';
import { ChangeGoodsRandomComponent } from './change-goods-random/change-goods-random.component';
import { EmailInformationComponent } from './email-information/email-information.component';

@NgModule({
  declarations: [
    MaintenanceComponent,
    EmailInformationComponent,
    DeletePeriodComponent,
    ChangePeriodComponent,
    ChangeGoodsRandomComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    SharedModule,
    TabsModule,
    ReactiveFormsModule,
  ],
})
export class MaintenanceModule {}
