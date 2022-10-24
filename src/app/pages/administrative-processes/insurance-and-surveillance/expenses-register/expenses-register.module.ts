import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpensesRegisterRoutingModule } from './expenses-register-routing.module';
import { ExpensesRegisterComponent } from './expenses-register/expenses-register.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ExpensesDataComponent } from './expenses-data/expenses-data.component';
import { ExpensesGoodsComponent } from './expenses-goods/expenses-goods.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

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
