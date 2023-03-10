import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { AffailrDetailComponent } from './affailr-detail/affailr-detail.component';
import { AffairListComponent } from './affair-list/affair-list.component';
import { AffairRoutingModule } from './affair-routing.module';

@NgModule({
  declarations: [AffairListComponent, AffailrDetailComponent],
  imports: [
    CommonModule,
    AffairRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class AffairModule {}
