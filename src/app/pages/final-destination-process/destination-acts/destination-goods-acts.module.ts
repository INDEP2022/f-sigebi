import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DestinationActsDelegationComponent } from './destination-acts-delegation/destination-acts-delegation.component';
import { DestinationGoodsActsComponent } from './destination-acts/destination-goods-acts.component';
import { DestinationGoodsActsRoutingModule } from './destination-goods-acts-routing.module';

@NgModule({
  declarations: [
    DestinationGoodsActsComponent,
    DestinationActsDelegationComponent,
  ],
  imports: [
    CommonModule,
    DestinationGoodsActsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    NgScrollbarModule,
    DelegationSharedComponent,
  ],
})
export class DestinationGoodsActsModule {}
