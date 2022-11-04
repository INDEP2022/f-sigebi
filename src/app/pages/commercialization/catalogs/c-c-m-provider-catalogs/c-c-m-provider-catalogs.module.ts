import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CCCClientsModalComponent } from './c-c-c-clients-modal/c-c-c-clients-modal.component';
import { CCCProviderCatalogsMainComponent } from './c-c-c-provider-catalogs-main/c-c-c-provider-catalogs-main.component';
import { CCCProviderCatalogsModalComponent } from './c-c-c-provider-catalogs-modal/c-c-c-provider-catalogs-modal.component';
import { CCMProviderCatalogsRoutingModule } from './c-c-m-provider-catalogs-routing.module';

@NgModule({
  declarations: [
    CCCProviderCatalogsMainComponent,
    CCCClientsModalComponent,
    CCCProviderCatalogsModalComponent,
  ],
  imports: [
    CommonModule,
    CCMProviderCatalogsRoutingModule,
    SharedModule,
    NgScrollbarModule,
    ModalModule.forChild(),
  ],
})
export class CCMProviderCatalogsModule {}
