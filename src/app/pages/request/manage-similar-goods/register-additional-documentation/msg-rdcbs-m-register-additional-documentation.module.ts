import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { MsgRdcbsMRegisterAdditionalDocumentationRoutingModule } from './msg-rdcbs-m-register-additional-documentation-routing.module';
import { MsgRdcbsCRegisterAdditionalDocumentationComponent } from './register-additional-documentation/msg-rdcbs-c-register-additional-documentation.component';

@NgModule({
  declarations: [MsgRdcbsCRegisterAdditionalDocumentationComponent],
  imports: [
    CommonModule,
    SharedRequestModule,
    SharedModule,
    MsgRdcbsMRegisterAdditionalDocumentationRoutingModule,
  ],
  providers: [BsModalService],
})
export class MsgRdcbsMRegisterAdditionalDocumentationModule {}
