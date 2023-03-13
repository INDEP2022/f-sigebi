import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TableReplaceColumnModalComponent } from 'src/app/@standalone/modals/table-replace-column-modal/table-replace-column-modal.component';
import { CleanFiltersSharedComponent } from 'src/app/@standalone/shared-forms/clean-filters-shared/clean-filters-shared.component';
import { ElaborateUsersSharedComponent } from 'src/app/@standalone/shared-forms/elaborate-users-shared/elaborate-users-shared.component';
import { GoodsTableSharedComponent } from 'src/app/@standalone/shared-forms/goods-table-shared/goods-table-shared.component';
import { ProceedingTypesSharedComponent } from 'src/app/@standalone/shared-forms/proceeding-types-shared/proceeding-types-shared.component';
import { SelectFormComponent } from 'src/app/@standalone/shared-forms/select-form/select-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableGoodsComponent } from '../table-goods/table-goods.component';
import { UpdateDatesGoodsComponent } from '../update-dates-goods/update-dates-goods.component';
import { ProceedingInfoComponent } from './components/proceeding-info/proceeding-info.component';
import { GoodActionsComponent } from './components/view-actions/good-actions/good-actions.component';
import { JustificationComponent } from './components/view-actions/justification/justification.component';
import { MaintenanceRecordsRoutingModule } from './maintenance-records-routing.module';
import { MaintenanceRecordsComponent } from './maintenance-records.component';

@NgModule({
  declarations: [
    MaintenanceRecordsComponent,
    ProceedingInfoComponent,
    JustificationComponent,
    GoodActionsComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    SelectFormComponent,
    ProceedingTypesSharedComponent,
    CleanFiltersSharedComponent,
    ElaborateUsersSharedComponent,
    UpdateDatesGoodsComponent,
    TableGoodsComponent,
    GoodsTableSharedComponent,
    TableReplaceColumnModalComponent,
  ],
})
export class MaintenanceRecordsModule {}
