import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DocResarcimientoSatXmlRoutingModule } from './doc-resarcimiento-sat-xml-routing.module';
import { DocResarcimientoSatXmlListComponent } from './doc-resarcimiento-sat-xml-list/doc-resarcimiento-sat-xml-list.component';
import { DocResarcimientoSatXmlFormComponent } from './doc-resarcimiento-sat-xml-form/doc-resarcimiento-sat-xml-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    DocResarcimientoSatXmlListComponent,
    DocResarcimientoSatXmlFormComponent
  ],
  imports: [
    CommonModule,
    DocResarcimientoSatXmlRoutingModule,
    SharedModule,
    ModalModule.forChild()
  ]
})
export class DocResarcimientoSatXmlModule { }
