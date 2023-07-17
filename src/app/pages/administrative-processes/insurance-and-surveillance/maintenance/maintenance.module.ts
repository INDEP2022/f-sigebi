import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { CustomSelectComponent } from 'src/app/@standalone/shared-forms/custom-select/custom-select.component';
import { GoodsSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-shared.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ChangeGoodsRandomComponent } from './change-goods-random/change-goods-random.component';
import { ListRandomsComponent } from './change-goods-random/list-randoms/list-randoms.component';
import { ChangePeriodComponent } from './change-period/change-period.component';
import { DeletePeriodComponent } from './delete-period/delete-period.component';
import { EmailInformationComponent } from './email-information/email-information.component';
import { MaintenanceRoutingModule } from './maintenance-routing.module';
import { MaintenanceComponent } from './maintenance/maintenance.component';
@NgModule({
  declarations: [
    MaintenanceComponent,
    EmailInformationComponent,
    DeletePeriodComponent,
    ChangePeriodComponent,
    ChangeGoodsRandomComponent,
    ListRandomsComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceRoutingModule,
    SharedModule,
    TabsModule,
    ReactiveFormsModule,
    CustomSelectComponent,
    GoodsSharedComponent,
    FormLoaderComponent,
    TooltipModule.forRoot(),
  ],
})
export class MaintenanceModule {}
