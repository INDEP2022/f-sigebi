import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
//Components
import { PaEFiMFinancialInfoRoutingModule } from './pa-e-fi-m-financial-info-routing.module';
import { PaEFiCSelectAttributesComponent } from './select-attributes/pa-e-fi-c-select-attributes.component';
import { PaEFiCSummaryFinancialInfoComponent } from './summary-financial-info/pa-e-fi-c-summary-financial-info.component';
//@Standalone Components
import { GoodsTypesSharedComponent } from '../../../../@standalone/shared-forms/goods-types-shared/goods-types-shared.component';

@NgModule({
  declarations: [
    PaEFiCSummaryFinancialInfoComponent,
    PaEFiCSelectAttributesComponent,
  ],
  imports: [
    CommonModule,
    PaEFiMFinancialInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
  ],
})
export class PaEFiMFinancialInfoModule {}
