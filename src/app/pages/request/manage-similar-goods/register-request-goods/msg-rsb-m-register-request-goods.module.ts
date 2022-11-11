import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MsgRsbMRegisterRequestGoodsRoutingModule } from './msg-rsb-m-register-request-goods-routing.module';
import { MsgRsbCRegisterRequestGoodsComponent } from './register-request-goods/msg-rsb-c-register-request-goods.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { RegisterDocumentationComponent } from './tabs/register-documentation/register-documentation.component';
import { AssociateExistingFileRequestComponent } from './tabs/associate-existing-file-request/associate-existing-file-request.component';
import { ModalNewCoverComponent } from './tabs/modal-new-cover/modal-new-cover.component';


@NgModule({
  declarations: [
    MsgRsbCRegisterRequestGoodsComponent,
    RegisterDocumentationComponent,
    AssociateExistingFileRequestComponent,
    ModalNewCoverComponent
  ],
  imports: [
    CommonModule,
    MsgRsbMRegisterRequestGoodsRoutingModule,
    SharedModule,
    TabsModule
  ]
})
export class MsgRsbMRegisterRequestGoodsModule { }
