import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';
//Routing
import { PaSsiMSiabSamiInteractionRoutingModule } from './pa-ssi-m-siab-sami-interaction-routing.module';
//Components
import { PaGrCGoodsRelationshipComponent } from './goods-relationship/pa-gr-c-goods-relationship.component';
import { PaMdgCMissingDamagedGoodsComponent } from './missing-damaged-goods/pa-mdg-c-missing-damaged-goods.component';
import { PaRmCRevenueManagementComponent } from './revenue-management/pa-rm-c-revenue-management.component';
import { PaPgCPaymentGoodsComponent } from './payment-goods/pa-pg-c-payment-goods.component';
import { PaVgCValueGoodsComponent } from './value-goods/pa-vg-c-value-goods.component';

@NgModule({
  declarations: [
    PaGrCGoodsRelationshipComponent,
    PaMdgCMissingDamagedGoodsComponent,
    PaRmCRevenueManagementComponent,
    PaPgCPaymentGoodsComponent,
    PaVgCValueGoodsComponent,
  ],
  imports: [
    CommonModule,
    PaSsiMSiabSamiInteractionRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
  ],
})
export class PaSsiMSiabSamiInteractionModule {}
