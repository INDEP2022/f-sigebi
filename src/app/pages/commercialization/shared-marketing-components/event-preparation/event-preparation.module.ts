import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

import { ExcelService } from 'src/app/common/services/excel.service';

import { EventTypeSharedComponent } from 'src/app/@standalone/shared-forms/event-type-shared/event-type-shared.component';
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';

import { StoreModule } from '@ngrx/store';
import { AddEditLoteModalComponent } from './add-edit-lote-modal/add-edit-lote-modal.component';
import { AvailableGoodsTableComponent } from './available-goods-table/available-goods-table.component';
import { CommerEventCustomersComponent } from './components/commer-event-customers/commer-event-customers.component';
import { CommerEventsListComponent } from './components/commer-events-list/commer-events-list.component';
import { CommerPackagesLotsComponent } from './components/commer-packages-lots/commer-packages-lots.component';
import { EventDataFormComponent } from './components/event-data-form/event-data-form.component';
import { EventGoodsLotsListActionsComponent } from './components/event-goods-lots-list-actions/event-goods-lots-list-actions.component';
import { EventGoodsLotsListComponent } from './components/event-goods-lots-list/event-goods-lots-list.component';
import { EventLotFormComponent } from './components/event-lot-form/event-lot-form.component';
import { EventLotsListComponent } from './components/event-lots-list/event-lots-list.component';
import { EventPreparationStadisticsComponent } from './components/event-preparation-stadistics/event-preparation-stadistics.component';
import { ReservedGoodsComponent } from './components/reserved-goods/reserved-goods.component';
import { CreateNewEventModalComponent } from './create-new-event-modal/create-new-event-modal.component';
import { CustomerCatalogsTableComponent } from './customer-catalogs-table/customer-catalogs-table.component';
import { EventPreparationRoutingModule } from './event-preparation-routing.module';
import { EventPreparationComponent } from './event-preparation/event-preparation.component';
import { GroundsStatusModalComponent } from './grounds-status-modal/grounds-status-modal.component';
import { ReasonsModelComponent } from './reasons-model/reasons-model.component';
import { RejectedGoodsTableComponent } from './rejected-goods-table/rejected-goods-table.component';
import { SelectEventModalComponent } from './select-event-modal/select-event-modal.component';
import { eventPreparationReducer } from './store/event-preparation.reducer';

@NgModule({
  declarations: [
    EventPreparationComponent,
    SelectEventModalComponent,
    CreateNewEventModalComponent,
    AddEditLoteModalComponent,
    CustomerCatalogsTableComponent,
    AvailableGoodsTableComponent,
    RejectedGoodsTableComponent,
    GroundsStatusModalComponent,
    ReasonsModelComponent,
    EventDataFormComponent,
    CommerEventsListComponent,
    CommerPackagesLotsComponent,
    CommerEventCustomersComponent,
    ReservedGoodsComponent,
    EventPreparationStadisticsComponent,
    EventLotsListComponent,
    EventGoodsLotsListComponent,
    EventLotFormComponent,
    EventGoodsLotsListActionsComponent,
  ],
  imports: [
    CommonModule,
    EventPreparationRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    EventsSharedComponent,
    EventTypeSharedComponent,
    TabsModule,
    ModalModule,
    StoreModule.forFeature('eventPreparation', eventPreparationReducer),
  ],
  exports: [
    CustomerCatalogsTableComponent,
    AvailableGoodsTableComponent,
    RejectedGoodsTableComponent,
  ],
  providers: [ExcelService],
})
export class EventPreparationModule {}
