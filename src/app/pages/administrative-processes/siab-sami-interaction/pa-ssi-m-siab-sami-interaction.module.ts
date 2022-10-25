import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
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
import { PaSsiCSiabSamiInteractionComponent } from './pa-ssi-c-siab-sami-interaction.component';
import { PaPgCPaymentGoodsComponent } from './payment-goods/pa-pg-c-payment-goods.component';
import { PaRmCRevenueManagementComponent } from './revenue-management/pa-rm-c-revenue-management.component';
import { PaVgCValueGoodsComponent } from './value-goods/pa-vg-c-value-goods.component';

@NgModule({
  declarations: [
    PaGrCGoodsRelationshipComponent,
    PaMdgCMissingDamagedGoodsComponent,
    PaRmCRevenueManagementComponent,
    PaPgCPaymentGoodsComponent,
    PaVgCValueGoodsComponent,
    PaSsiCSiabSamiInteractionComponent,
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
