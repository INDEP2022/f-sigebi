import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { RegulatoyFormComponent } from './regulatory-form/regulatoy-form.component';
import { RegulatoryListComponent } from './regulatory-list/regulatory-list.component';
import { RegulatoryRoutingModule } from './regulatory-routing.module';

@NgModule({
  declarations: [RegulatoyFormComponent, RegulatoryListComponent],
  imports: [
    CommonModule,
    RegulatoryRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class RegulatoryModule {}
