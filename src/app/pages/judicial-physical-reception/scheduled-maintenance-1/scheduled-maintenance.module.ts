import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectFormComponent } from './../../../@standalone/shared-forms/select-form/select-form.component';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ExcelReportComponent } from 'src/app/@standalone/excel-report/excel-report.component';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { CleanFiltersSharedComponent } from 'src/app/@standalone/shared-forms/clean-filters-shared/clean-filters-shared.component';
import { ElaborateUsersSharedComponent } from 'src/app/@standalone/shared-forms/elaborate-users-shared/elaborate-users-shared.component';
import { GoodtrackerButtonComponent } from 'src/app/@standalone/shared-forms/goodtracker-button/goodtracker-button.component';
import { ProceedingTypesSharedComponent } from 'src/app/@standalone/shared-forms/proceeding-types-shared/proceeding-types-shared.component';
import { RegionalCoordSharedComponent } from 'src/app/@standalone/shared-forms/regional-coord-shared/regional-coord-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { KeyProceedingsFormComponent } from '../key-proceedings-form/key-proceedings-form.component';
import { TableGoodsComponent } from '../table-goods/table-goods.component';
import { UpdateDatesGoodsComponent } from '../update-dates-goods/update-dates-goods.component';
import { AnioInputComponent } from './scheduled-maintenance-detail/components/anio-input/anio-input.component';
import { CantsComponent } from './scheduled-maintenance-detail/components/cants/cants.component';
import { ExcelButtonComponent } from './scheduled-maintenance-detail/components/excel-button/excel-button.component';
import { FolioInputComponent } from './scheduled-maintenance-detail/components/folio-input/folio-input.component';
import { MassiveDeleteButtonComponent } from './scheduled-maintenance-detail/components/massive-delete-button/massive-delete-button.component';
import { MesInputComponent } from './scheduled-maintenance-detail/components/mes-input/mes-input.component';
import { TransferSelectComponent } from './scheduled-maintenance-detail/components/transfer-select/transfer-select.component';
import { ScheduledMaintenanceDetailComponent } from './scheduled-maintenance-detail/scheduled-maintenance-detail.component';
import { ScheduledMaintenanceRoutingModule } from './scheduled-maintenance-routing.module';
import { ScheduledMaintenanceComponent } from './scheduled-maintenance.component';

@NgModule({
  declarations: [
    ScheduledMaintenanceComponent,
    ScheduledMaintenanceDetailComponent,
    CantsComponent,
    MassiveDeleteButtonComponent,
    ExcelButtonComponent,
    AnioInputComponent,
    FolioInputComponent,
    MesInputComponent,
    TransferSelectComponent,
  ],
  imports: [
    CommonModule,
    ScheduledMaintenanceRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    SelectFormComponent,
    ExcelReportComponent,
    ProceedingTypesSharedComponent,
    RegionalCoordSharedComponent,
    ElaborateUsersSharedComponent,
    KeyProceedingsFormComponent,
    CleanFiltersSharedComponent,
    UpdateDatesGoodsComponent,
    TableGoodsComponent,
    GoodtrackerButtonComponent,
    FormLoaderComponent,
    AccordionModule,
  ],
})
export class ScheduledMaintenanceModule {}
