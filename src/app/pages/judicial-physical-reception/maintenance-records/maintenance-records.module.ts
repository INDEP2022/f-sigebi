import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TableReplaceColumnModalComponent } from 'src/app/@standalone/modals/table-replace-column-modal/table-replace-column-modal.component';
import { CleanFiltersSharedComponent } from 'src/app/@standalone/shared-forms/clean-filters-shared/clean-filters-shared.component';
import { ElaborateUsersSharedComponent } from 'src/app/@standalone/shared-forms/elaborate-users-shared/elaborate-users-shared.component';
import { GoodsTableSharedComponent } from 'src/app/@standalone/shared-forms/goods-table-shared/goods-table-shared.component';
import { GoodtrackerButtonComponent } from 'src/app/@standalone/shared-forms/goodtracker-button/goodtracker-button.component';
import { ProceedingTypesSharedComponent } from 'src/app/@standalone/shared-forms/proceeding-types-shared/proceeding-types-shared.component';
import { SafeTableSharedComponent } from 'src/app/@standalone/shared-forms/safe-table-shared/safe-table-shared.component';
import { SelectFormComponent } from 'src/app/@standalone/shared-forms/select-form/select-form.component';
import { SelectModalTableSharedComponent } from 'src/app/@standalone/shared-forms/select-modal-table-shared/select-modal-table-shared.component';
import { WarehouseTableSharedComponent } from 'src/app/@standalone/shared-forms/warehouse-table-shared/warehouse-table-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { TableGoodsComponent } from '../table-goods/table-goods.component';
import { UpdateDatesGoodsComponent } from '../update-dates-goods/update-dates-goods.component';
import { ProceedingInfoComponent } from './components/proceeding-info/proceeding-info.component';
import { RecibeFormComponent } from './components/proceeding-info/recibe-form/recibe-form.component';
import { TableGoodMaintenanceComponent } from './components/table-good-maintenance/table-good-maintenance.component';
import { GoodActionsComponent } from './components/view-actions/good-actions/good-actions.component';
import { JustificationComponent } from './components/view-actions/justification/justification.component';
import { WarehouseProceedingsComponent } from './components/view-actions/warehouse-proceedings/warehouse-proceedings.component';
import { MaintenanceRecordsRoutingModule } from './maintenance-records-routing.module';
import { MaintenanceRecordsComponent } from './maintenance-records.component';

@NgModule({
  declarations: [
    MaintenanceRecordsComponent,
    ProceedingInfoComponent,
    JustificationComponent,
    GoodActionsComponent,
    TableGoodMaintenanceComponent,
    WarehouseProceedingsComponent,
    RecibeFormComponent,
  ],
  imports: [
    CommonModule,
    MaintenanceRecordsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    AccordionModule,
    SelectFormComponent,
    ProceedingTypesSharedComponent,
    CleanFiltersSharedComponent,
    ElaborateUsersSharedComponent,
    UpdateDatesGoodsComponent,
    TableGoodsComponent,
    GoodsTableSharedComponent,
    TableReplaceColumnModalComponent,
    WarehouseTableSharedComponent,
    SafeTableSharedComponent,
    SelectModalTableSharedComponent,
    GoodtrackerButtonComponent,
  ],
})
export class MaintenanceRecordsModule {}
