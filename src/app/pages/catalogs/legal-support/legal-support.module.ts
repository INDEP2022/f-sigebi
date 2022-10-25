import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { LegalSupportFormComponent } from './legal-support-form/legal-support-form.component';
import { LegalSupportListComponent } from './legal-support-list/legal-support-list.component';
import { LegalSupportRoutingModule } from './legal-support-routing.module';

@NgModule({
  declarations: [LegalSupportListComponent, LegalSupportFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    LegalSupportRoutingModule,
  ],
})
export class LegalSupportModule {}
