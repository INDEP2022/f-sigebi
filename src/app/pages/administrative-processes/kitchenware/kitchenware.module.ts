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
import { KitchenwareRoutingModule } from './kitchenware-routing.module';
import { PropertyRegistrationComponent } from './property-registration/property-registration.component';

@NgModule({
  declarations: [PropertyRegistrationComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    KitchenwareRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsSharedComponent,
  ],
})
export class KitchenwareModule {}
