import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SharedModule } from 'src/app/shared/shared.module';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';

//Components
import { GoodsSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-shared.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { PaCdgiCChangeDestinationGoodsIndicatorsComponent } from './pa-cdgi-c-change-destination-goods-indicators/pa-cdgi-c-change-destination-goods-indicators.component';
import { PaMChangeDestinationGoodsIndicatorsRoutingModule } from './pa-m-change-destination-goods-indicators-routing.module';

@NgModule({
  declarations: [PaCdgiCChangeDestinationGoodsIndicatorsComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    PaMChangeDestinationGoodsIndicatorsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
    GoodsSharedComponent,
  ],
})
export class PaMChangeDestinationGoodsIndicatorsModule {}
