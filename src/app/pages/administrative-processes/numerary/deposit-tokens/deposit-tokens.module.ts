import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from '../../../../shared/shared.module';
import { AddMovementComponent } from './add-movement/add-movement.component';
import { CustomdbclickComponent } from './customdbclick/customdbclick.component';
import { DepositTokensModalComponent } from './deposit-tokens-modal/deposit-tokens-modal.component';
import { DepositTokensRoutingModule } from './deposit-tokens-routing.module';
import { DepositTokensComponent } from './deposit-tokens/deposit-tokens.component';
import { ListGoodsComponent } from './list-goods/list-goods.component';
@NgModule({
  declarations: [
    DepositTokensComponent,
    DepositTokensModalComponent,
    CustomdbclickComponent,
    ListGoodsComponent,
    AddMovementComponent,
  ],
  imports: [
    CommonModule,
    DepositTokensRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    FormLoaderComponent,
    TooltipModule.forRoot(),
  ],
})
export class DepositTokensModule {}
