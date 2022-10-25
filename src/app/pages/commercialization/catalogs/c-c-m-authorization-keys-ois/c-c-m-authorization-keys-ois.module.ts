import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CCCaeeoCAuthorizationKeysFormComponent } from './c-c-caeeo-c-authorization-keys-form/c-c-caeeo-c-authorization-keys-form.component';
import { CCMAuthorizationKeysOisRoutingModule } from './c-c-m-authorization-keys-ois-routing.module';

@NgModule({
  declarations: [CCCaeeoCAuthorizationKeysFormComponent],
  imports: [
    CommonModule,
    CCMAuthorizationKeysOisRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CCMAuthorizationKeysOisModule {}
