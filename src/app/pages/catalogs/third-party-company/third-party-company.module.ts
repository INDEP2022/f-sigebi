import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ThirdPartyCompanyRoutingModule } from './third-party-company-routing.module';
import { ThirdPartyCompanyListComponent } from './third-party-company-list/third-party-company-list.component';
import { ThirdPartyCompanyFormComponent } from './third-party-company-form/third-party-company-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
