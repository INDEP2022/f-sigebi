import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

import { ExcelService } from 'src/app/common/services/excel.service';

import { EventTypeSharedComponent } from 'src/app/@standalone/shared-forms/event-type-shared/event-type-shared.component';
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';

import { AddEditLoteModalComponent } from './add-edit-lote-modal/add-edit-lote-modal.component';
import { AvailableGoodsTableComponent } from './available-goods-table/available-goods-table.component';
import { CBFFmdvdbCEventPreparationComponent } from './c-b-f-fmdvdb-c-event-preparation/c-b-f-fmdvdb-c-event-preparation.component';
import { CBFFmdvdbMEventPreparationRoutingModule } from './c-b-f-fmdvdb-m-event-preparation-routing.module';
import { CreateNewEventModalComponent } from './create-new-event-modal/create-new-event-modal.component';
import { CustomerCatalogsTableComponent } from './customer-catalogs-table/customer-catalogs-table.component';
import { RejectedGoodsTableComponent } from './rejected-goods-table/rejected-goods-table.component';
import { SelectEventModalComponent } from './select-event-modal/select-event-modal.component';
import { GroundsStatusModalComponent } from './grounds-status-modal/grounds-status-modal.component';
import { ReasonsModelComponent } from './reasons-model/reasons-model.component';

@NgModule({
  declarations: [
    CBFFmdvdbCEventPreparationComponent,
    SelectEventModalComponent,
    CreateNewEventModalComponent,
    AddEditLoteModalComponent,
    CustomerCatalogsTableComponent,
    AvailableGoodsTableComponent,
    RejectedGoodsTableComponent,
    GroundsStatusModalComponent,
    ReasonsModelComponent,
  ],
  imports: [
    CommonModule,
    CBFFmdvdbMEventPreparationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    EventsSharedComponent,
    EventTypeSharedComponent,
    TabsModule,
  ],
  exports: [
    CustomerCatalogsTableComponent,
    AvailableGoodsTableComponent,
    RejectedGoodsTableComponent,
  ],
  providers: [ExcelService],
})
export class CBFFmdvdbMEventPreparationModule {}
