import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '../../../../shared/shared.module';
import { ExpensesDataComponent } from './expenses-data/expenses-data.component';
import { ExpensesGoodsComponent } from './expenses-goods/expenses-goods.component';
import { ExpensesRegisterRoutingModule } from './expenses-register-routing.module';
import { ExpensesRegisterComponent } from './expenses-register/expenses-register.component';

@NgModule({
  declarations: [
    ExpensesRegisterComponent,
    ExpensesDataComponent,
    ExpensesGoodsComponent,
  ],
  imports: [
    CommonModule,
    ExpensesRegisterRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    TabsModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class ExpensesRegisterModule {}
