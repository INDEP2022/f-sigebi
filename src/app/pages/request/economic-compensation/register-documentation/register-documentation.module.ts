import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { RegisterDocumentationMainComponent } from './register-documentation-main/register-documentation-main.component';
import { RegisterDocumentationRoutingModule } from './register-documentation-routing.module';

@NgModule({
  declarations: [RegisterDocumentationMainComponent],
  imports: [
    CommonModule,
    RegisterDocumentationRoutingModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    BsDatepickerModule.forRoot(),
  ],
})
export class RegisterDocumentationModule {}
