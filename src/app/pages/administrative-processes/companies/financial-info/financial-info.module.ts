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
import { FinancialInfoRoutingModule } from './financial-info-routing.module';
import { SelectAttributesComponent } from './select-attributes/select-attributes.component';
import { SummaryFinancialInfoComponent } from './summary-financial-info/summary-financial-info.component';
//@Standalone Components
import { GoodsTypesSharedComponent } from '../../../../@standalone/shared-forms/goods-types-shared/goods-types-shared.component';

@NgModule({
  declarations: [SummaryFinancialInfoComponent, SelectAttributesComponent],
  imports: [
    CommonModule,
    FinancialInfoRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
  ],
})
export class FinancialInfoModule {}
