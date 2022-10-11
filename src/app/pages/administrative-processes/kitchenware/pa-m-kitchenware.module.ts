import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';

//Components
import { PaMKitchenwareRoutingModule } from './pa-m-kitchenware-routing.module';
import { PaKCPropertyRegistrationComponent } from './pa-k-c-property-registration/pa-k-c-property-registration.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';


@NgModule({
  declarations: [
    PaKCPropertyRegistrationComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    PaMKitchenwareRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent
  ]
})
export class PaMKitchenwareModule { }
