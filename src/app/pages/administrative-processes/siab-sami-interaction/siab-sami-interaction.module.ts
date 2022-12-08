import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';
//Routing
import { SiabSamiInteractionRoutingModule } from './siab-sami-interaction-routing.module';
//Components
import { GoodsRelationshipComponent } from './goods-relationship/goods-relationship.component';
import { MissingDamagedGoodsComponent } from './missing-damaged-goods/missing-damaged-goods.component';
import { PaymentGoodsComponent } from './payment-goods/payment-goods.component';
import { RevenueManagementComponent } from './revenue-management/revenue-management.component';
import { SiabSamiInteractionComponent } from './siab-sami-interaction.component';
import { ValueGoodsComponent } from './value-goods/value-goods.component';

@NgModule({
  declarations: [
    GoodsRelationshipComponent,
    MissingDamagedGoodsComponent,
    RevenueManagementComponent,
    PaymentGoodsComponent,
    ValueGoodsComponent,
    SiabSamiInteractionComponent,
  ],
  imports: [
    CommonModule,
    SiabSamiInteractionRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
  ],
})
export class SiabSamiInteractionModule {}
