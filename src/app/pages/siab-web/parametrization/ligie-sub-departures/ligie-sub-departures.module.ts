import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { LigieSubDeparturesFormComponent } from './ligie-sub-departures-form/ligie-sub-departures-form.component';
import { LigieSubDeparturesListComponent } from './ligie-sub-departures-list/ligie-sub-departures-list.component';
import { LigieSubDeparturesRoutingModule } from './ligie-sub-departures-routing.module';

@NgModule({
  declarations: [
    LigieSubDeparturesListComponent,
    LigieSubDeparturesFormComponent,
  ],
  imports: [
    CommonModule,
    LigieSubDeparturesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class LigieSubDeparturesModule {}
