import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { PageSetupModalComponent } from './page-setup-modal/page-setup-modal.component';
import { PageSetupRoutingModule } from './page-setup-routing.module';
import { PageSetupComponent } from './page-setup/page-setup.component';

@NgModule({
  declarations: [PageSetupComponent, PageSetupModalComponent],
  imports: [
    CommonModule,
    PageSetupRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class PageSetupModule {}
