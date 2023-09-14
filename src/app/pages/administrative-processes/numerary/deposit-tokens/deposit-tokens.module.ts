import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxCurrencyModule } from 'ngx-currency';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from '../../../../shared/shared.module';
import { AddMovementComponent } from './add-movement/add-movement.component';
import { CustomdbclickComponent } from './customdbclick/customdbclick.component';
import { Customdbclick2Component } from './customdbclick2/customdbclick2.component';
import { CustomdbclickdepositComponent } from './customdbclickdeposit/customdbclickdeposit.component';
import { Customdbclickdeposit2Component } from './customdbclickdeposit2/customdbclickdeposit2.component';
import { DepositTokensModalComponent } from './deposit-tokens-modal/deposit-tokens-modal.component';
import { DepositTokensRoutingModule } from './deposit-tokens-routing.module';
import { DepositTokensComponent } from './deposit-tokens/deposit-tokens.component';
import { CustomMultiSelectFilterComponent } from './deposit-tokens/filterAccount';
import { CustomDateFilterComponent_ } from './deposit-tokens/searchDate';
import { ListGoodsComponent } from './list-goods/list-goods.component';

export const customCurrencyMaskConfig = {
  align: 'right',
  allowNegative: false,
  allowZero: true,
  decimal: '.',
  precision: 2,
  prefix: '',
  suffix: '',
  thousands: ',',
  nullable: false,
};

@NgModule({
  declarations: [
    DepositTokensComponent,
    DepositTokensModalComponent,
    CustomdbclickComponent,
    ListGoodsComponent,
    AddMovementComponent,
    CustomdbclickdepositComponent,
    CustomDateFilterComponent_,
    Customdbclickdeposit2Component,
    Customdbclick2Component,
    CustomMultiSelectFilterComponent,
  ],
  imports: [
    CommonModule,
    DepositTokensRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    FormLoaderComponent,
    TooltipModule.forRoot(),
    NgSelectModule,
    NgxCurrencyModule.forRoot(customCurrencyMaskConfig),
  ],
})
export class DepositTokensModule {}
