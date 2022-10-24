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
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { PaMResquestNumberingChangeRoutingModule } from './pa-m-resquest-numbering-change-routing.module';
import { PaRncCResquestNumberingChangeComponent } from './pa-rnc-c-resquest-numbering-change/pa-rnc-c-resquest-numbering-change.component';

@NgModule({
  declarations: [PaRncCResquestNumberingChangeComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    PaMResquestNumberingChangeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
  ],
})
export class PaMResquestNumberingChangeModule {}
