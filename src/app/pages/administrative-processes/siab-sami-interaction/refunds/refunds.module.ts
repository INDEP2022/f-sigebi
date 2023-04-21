import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
//Routing
import { PaRMRefundsRoutingModule } from './refunds-routing.module';
//@Standalone Components
import { AddressesSharedComponent } from 'src/app/@standalone/shared-forms/addresses-shared/addresses-shared.component';
import { AreasSharedComponent } from 'src/app/@standalone/shared-forms/areas-shared/areas-shared.component';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { CabmsSharedComponent } from 'src/app/@standalone/shared-forms/cabms-shared/cabms-shared.component';
import { ConceptsSharedComponent } from 'src/app/@standalone/shared-forms/concepts-shared/concepts-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-shared.component';
import { TaxpayersSharedComponent } from 'src/app/@standalone/shared-forms/taxpayers-shared/taxpayers-shared.component';
import { TransferenteSharedComponent } from 'src/app/@standalone/shared-forms/transferents-shared/transferents-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
//Components
import { CuentasSharedComponent } from 'src/app/@standalone/shared-forms/cuentas-shared/cuentas-shared.component';
import { AddGoodsComponent } from './add-goods/add-goods.component';
import { CheckDetailComponent } from './check-detail/check-detail.component';
import { GoodsRelationshipComponent } from './goods-relationship/goods-relationship.component';
import { PaymentRequestItemsComponent } from './payment-request-items/payment-request-items.component';
import { PaymentRequestComponent } from './payment-request/payment-request.component';

@NgModule({
  declarations: [
    PaymentRequestComponent,
    PaymentRequestItemsComponent,
    CheckDetailComponent,
    GoodsRelationshipComponent,
    AddGoodsComponent,
  ],
  imports: [
    CommonModule,
    PaRMRefundsRoutingModule,
    SharedModule,
    FormsModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    AddressesSharedComponent,
    ConceptsSharedComponent,
    AreasSharedComponent,
    TaxpayersSharedComponent,
    UsersSharedComponent,
    CabmsSharedComponent,
    GoodsSharedComponent,
    TransferenteSharedComponent,
    BanksSharedComponent,
    DelegationSharedComponent,
    //Oscar
    CuentasSharedComponent,
  ],
})
export class PaRMRefundsModule {}
