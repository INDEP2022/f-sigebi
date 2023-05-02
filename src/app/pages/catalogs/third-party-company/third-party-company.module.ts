import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ThirdPartyCompanyFormComponent } from './third-party-company-form/third-party-company-form.component';
import { ThirdPartyCompanyListComponent } from './third-party-company-list/third-party-company-list.component';
import { ThirdPartyCompanyRoutingModule } from './third-party-company-routing.module';

@NgModule({
  declarations: [
    ThirdPartyCompanyListComponent,
    ThirdPartyCompanyFormComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    ThirdPartyCompanyRoutingModule,
  ],
})
export class ThirdPartyCompanyModule {}
