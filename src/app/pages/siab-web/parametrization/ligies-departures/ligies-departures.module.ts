import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { LigiesDeparturesFormComponent } from './ligies-departures-form/ligies-departures-form.component';
import { LigiesDeparturesListComponent } from './ligies-departures-list/ligies-departures-list.component';
import { LigiesDeparturesRoutingModule } from './ligies-departures-routing.module';

@NgModule({
  declarations: [LigiesDeparturesListComponent, LigiesDeparturesFormComponent],
  imports: [
    CommonModule,
    LigiesDeparturesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class LigiesDeparturesModule {}
