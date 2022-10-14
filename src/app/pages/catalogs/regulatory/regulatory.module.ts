import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegulatoryRoutingModule } from './regulatory-routing.module';
import { RegulatoyFormComponent } from './regulatory-form/regulatoy-form.component';
import { RegulatoryListComponent } from './regulatory-list/regulatory-list.component';
import { SharedModule } from '../../../shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
