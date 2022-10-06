import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LegalSupportRoutingModule } from './legal-support-routing.module';
import { LegalSupportListComponent } from './legal-support-list/legal-support-list.component';
import { LegalSupportFormComponent } from './legal-support-form/legal-support-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
