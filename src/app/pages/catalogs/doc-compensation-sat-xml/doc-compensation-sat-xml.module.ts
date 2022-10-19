import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocCompensationSatXmlRoutingModule } from './doc-compensation-sat-xml-routing.module';
import { DocCompensationSatXmlListComponent } from './doc-compensation-sat-xml-list/doc-compensation-sat-xml-list.component';
import { DocCompensationSatXmlFormComponent } from './doc-compensation-sat-xml-form/doc-compensation-sat-xml-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
