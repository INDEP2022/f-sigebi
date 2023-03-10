import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { LegalAffairDetailComponent } from './legal-affair-detail/legal-affair-detail.component';
import { LegalAffairListComponent } from './legal-affair-list/legal-affair-list.component';
import { LegalAffairRoutingModule } from './legal-affair-routing.module';

@NgModule({
  declarations: [LegalAffairListComponent, LegalAffairDetailComponent],
  imports: [
    CommonModule,
    LegalAffairRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class LegalAffairModule {}
