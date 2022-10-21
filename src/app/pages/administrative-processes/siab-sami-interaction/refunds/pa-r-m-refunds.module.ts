import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
//Routing
import { PaRMRefundsRoutingModule } from './pa-r-m-refunds-routing.module';
//@Standalone Components
import { AddressesSharedComponent } from 'src/app/@standalone/shared-forms/addresses-shared/addresses-shared.component';
import { ConceptsSharedComponent } from 'src/app/@standalone/shared-forms/concepts-shared/concepts-shared.component';
import { AreasSharedComponent } from 'src/app/@standalone/shared-forms/areas-shared/areas-shared.component';
import { TaxpayersSharedComponent } from 'src/app/@standalone/shared-forms/taxpayers-shared/taxpayers-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { CabmsSharedComponent } from 'src/app/@standalone/shared-forms/cabms-shared/cabms-shared.component';
import { GoodsSharedComponent } from 'src/app/@standalone/shared-forms/goods-shared/goods-shared.component';
import { TransferenteSharedComponent } from 'src/app/@standalone/shared-forms/transferents-shared/transferents-shared.component';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component'
//Components
import { PaPrCPaymentRequestComponent } from './payment-request/pa-pr-c-payment-request.component';
import { PaPriCPaymentRequestItemsComponent } from './payment-request-items/pa-pri-c-payment-request-items.component';
import { PaCdCCheckDetailComponent } from './check-detail/pa-cd-c-check-detail.component';
import { PaGrCGoodsRelationshipComponent } from './goods-relationship/pa-gr-c-goods-relationship.component';
import { PaAgCAddGoodsComponent } from './add-goods/pa-ag-c-add-goods.component';

@NgModule({
  declarations: [
    PaPrCPaymentRequestComponent,
    PaPriCPaymentRequestItemsComponent,
    PaCdCCheckDetailComponent,
    PaGrCGoodsRelationshipComponent,
    PaAgCAddGoodsComponent
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
    DelegationSharedComponent
  ]
})
export class PaRMRefundsModule { }
