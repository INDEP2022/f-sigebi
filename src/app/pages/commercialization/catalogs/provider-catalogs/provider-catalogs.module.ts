import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { ClientsModalComponent } from './clients-modal/clients-modal.component';
import { ProviderCatalogsMainComponent } from './provider-catalogs-main/provider-catalogs-main.component';
import { ProviderCatalogsModalComponent } from './provider-catalogs-modal/provider-catalogs-modal.component';
import { ProviderCatalogsRoutingModule } from './provider-catalogs-routing.module';

@NgModule({
  declarations: [
    ProviderCatalogsMainComponent,
    ClientsModalComponent,
    ProviderCatalogsModalComponent,
  ],
  imports: [
    CommonModule,
    ProviderCatalogsRoutingModule,
    SharedModule,
    NgScrollbarModule,
    ModalModule.forChild(),
  ],
})
export class ProviderCatalogsModule {}
