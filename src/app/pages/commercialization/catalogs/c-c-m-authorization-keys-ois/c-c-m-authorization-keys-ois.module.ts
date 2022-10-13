import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CCMAuthorizationKeysOisRoutingModule } from './c-c-m-authorization-keys-ois-routing.module';
import { CCCaeeoCAuthorizationKeysFormComponent } from './c-c-caeeo-c-authorization-keys-form/c-c-caeeo-c-authorization-keys-form.component';


@NgModule({
  declarations: [
    CCCaeeoCAuthorizationKeysFormComponent
  ],
  imports: [
    CommonModule,
    CCMAuthorizationKeysOisRoutingModule,
    SharedModule,
    ModalModule.forChild()
  ]
})
export class CCMAuthorizationKeysOisModule { }
