import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';

import { ExcelService } from 'src/app/common/services/excel.service';

import { EventTypeSharedComponent } from 'src/app/@standalone/shared-forms/event-type-shared/event-type-shared.component';
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';

import { StoreModule } from '@ngrx/store';
import { ComerEventTraspComponent } from './components/comer-event-trasp/comer-event-trasp.component';
import { CommerEventCustomersComponent } from './components/commer-event-customers/commer-event-customers.component';
import { CommerEventsListComponent } from './components/commer-events-list/commer-events-list.component';
import { CommerPackagesLotsComponent } from './components/commer-packages-lots/commer-packages-lots.component';
import { EventDataFormComponent } from './components/event-data-form/event-data-form.component';
import { EventGoodsLotsListActionsComponent } from './components/event-goods-lots-list-actions/event-goods-lots-list-actions.component';
import { EventGoodsLotsListComponent } from './components/event-goods-lots-list/event-goods-lots-list.component';
import { EventLotFormComponent } from './components/event-lot-form/event-lot-form.component';
import { EventLotsListComponent } from './components/event-lots-list/event-lots-list.component';
import { EventPreparationStadisticsComponent } from './components/event-preparation-stadistics/event-preparation-stadistics.component';
import { RejectedGoodsListComponent } from './components/rejected-goods-list/rejected-goods-list.component';
import { ReservedGoodsComponent } from './components/reserved-goods/reserved-goods.component';
import { ConsigmentsContainerComponent } from './consigments/componets/consigments-container/consigments-container.component';
import { ConsigmentsEventsComponent } from './consigments/componets/consigments-events/consigments-events.component';
import { ConsigmentsGoodsComponent } from './consigments/componets/consigments-goods/consigments-goods.component';
import { ConsigmentsLotsComponent } from './consigments/componets/consigments-lots/consigments-lots.component';
import { EventPreparationRoutingModule } from './event-preparation-routing.module';
import { EventPreparationComponent } from './event-preparation/event-preparation.component';
import { GroundsStatusModalComponent } from './grounds-status-modal/grounds-status-modal.component';
import { ReasonsModelComponent } from './reasons-model/reasons-model.component';
import { eventPreparationReducer } from './store/event-preparation.reducer';

@NgModule({
  declarations: [
    GroundsStatusModalComponent,
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
    RejectedGoodsListComponent,
    ComerEventTraspComponent,
    ConsigmentsEventsComponent,
    ConsigmentsLotsComponent,
    ConsigmentsGoodsComponent,
    ConsigmentsContainerComponent,
    ReasonsModelComponent,
    EventPreparationComponent,
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
  providers: [ExcelService],
})
export class EventPreparationModule {}
