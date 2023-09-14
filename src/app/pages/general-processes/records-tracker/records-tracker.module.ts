import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ServicesSharedComponent } from 'src/app/@standalone/shared-forms/services-shared/services-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { GoodsCharacteristicsModule } from '../goods-characteristics/goods-characteristics.module';
import { ButtonSelectComponent } from './components/button-select/button-select.component';
import { ButtonViewComponent } from './components/button-select/button-view.component';
import { ViewAtributeGoodModalComponent } from './components/view-atribute-good-modal/view-atribute-good-modal.component';
import { RecordsTrackerRoutingModule } from './records-tracker-routing.module';
import { RecordsTrackerComponent } from './records-tracker/records-tracker.component';

@NgModule({
  declarations: [
    RecordsTrackerComponent,
    ButtonSelectComponent,
    ButtonViewComponent,
    ViewAtributeGoodModalComponent,
  ],
  imports: [
    CommonModule,
    RecordsTrackerRoutingModule,
    SharedModule,
    AccordionModule,
    ServicesSharedComponent,
    GoodsCharacteristicsModule,
  ],
})
export class RecordsTrackerModule {}
