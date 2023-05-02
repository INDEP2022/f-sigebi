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
import { AccountBanksSharedComponent } from 'src/app/@standalone/shared-forms/account-banks-shared/account-banks-shared.component';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { ClassificationOfGoodsSharedComponent } from 'src/app/@standalone/shared-forms/classification-of-goods-shared/classification-of-goods-shared.component';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
import { ProcessesSharedComponent } from 'src/app/@standalone/shared-forms/processes-shared/packages-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { ChangeOfGoodClassificationRoutingModule } from './change-of-good-classification-routing.module';
import { ChangeOfGoodClassificationComponent } from './change-of-good-classification/change-of-good-classification.component';

@NgModule({
  declarations: [ChangeOfGoodClassificationComponent],
  imports: [
    CommonModule,
    SharedModule,
    Ng2SmartTableModule,
    ChangeOfGoodClassificationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDropdownModule,
    BsDatepickerModule,
    TabsModule,
    ModalModule.forChild(),
    GoodsTypesSharedComponent,
    UsersSharedComponent,
    GoodsStatusSharedComponent,
    ProcessesSharedComponent,
    ClassificationOfGoodsSharedComponent,
    BanksSharedComponent,
    AccountBanksSharedComponent,
  ],
})
export class ChangeOfStatusModule {}
