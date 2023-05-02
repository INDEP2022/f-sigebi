import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocCompensationSatXmlFormComponent } from './doc-compensation-sat-xml-form/doc-compensation-sat-xml-form.component';
import { DocCompensationSatXmlListComponent } from './doc-compensation-sat-xml-list/doc-compensation-sat-xml-list.component';
import { DocCompensationSatXmlRoutingModule } from './doc-compensation-sat-xml-routing.module';

@NgModule({
  declarations: [
    DocCompensationSatXmlListComponent,
    DocCompensationSatXmlFormComponent,
  ],
  imports: [
    CommonModule,
    DocCompensationSatXmlRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DocCompensationSatXmlModule {}
