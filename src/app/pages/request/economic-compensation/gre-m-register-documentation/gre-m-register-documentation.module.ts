import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { GreCRegisterDocumentationMainComponent } from './gre-c-register-documentation-main/gre-c-register-documentation-main.component';
import { GreMRegisterDocumentationRoutingModule } from './gre-m-register-documentation-routing.module';

@NgModule({
  declarations: [GreCRegisterDocumentationMainComponent],
  imports: [
    CommonModule,
    GreMRegisterDocumentationRoutingModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class GreMRegisterDocumentationModule {}
