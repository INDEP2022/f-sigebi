import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { RegisterAdditionalDocumentationRoutingModule } from './register-additional-documentation-routing.module';
import { RegisterAdditionalDocumentationComponent } from './register-additional-documentation/register-additional-documentation.component';

@NgModule({
  declarations: [RegisterAdditionalDocumentationComponent],
  imports: [
    CommonModule,
    SharedRequestModule,
    SharedModule,
    RegisterAdditionalDocumentationRoutingModule,
  ],
  providers: [BsModalService],
})
export class RegisterAdditionalDocumentationModule {}
