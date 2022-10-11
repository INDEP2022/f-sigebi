import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { PaGmMGoodsManagementRoutingModule } from './pa-gm-m-goods-management-routing.module';
//Components
import { PaGmscCGoodsManagementSocialCabinetComponent } from './goods-management-social-cabinet/pa-gmsc-c-goods-management-social-cabinet.component';


@NgModule({
  declarations: [
    PaGmscCGoodsManagementSocialCabinetComponent
  ],
  imports: [
    CommonModule,
    PaGmMGoodsManagementRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PaGmMGoodsManagementModule { }
