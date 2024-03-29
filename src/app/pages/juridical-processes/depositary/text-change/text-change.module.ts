import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ModalComponent } from './modal/modal-component';
import { ListdocsComponent } from './office/listdocs/listdocs.component';
import { ModalPersonaOficinaComponent } from './office/modal-persona-oficina/modal-persona-oficina.component';
import { OfficeComponent } from './office/office.component';
import { OpinionComponent } from './opinion/opinion.component';
import { tablaModalComponent } from './tabla-modal/tablaModal-component';
import { TablaOficioModalComponent } from './tabla-oficio-modal/tabla-oficio-modal.component';
import { TextChangeRoutingModule } from './text-change-routing.module';
import { TextChangeComponent } from './text-change/text-change.component';

@NgModule({
  declarations: [
    TextChangeComponent,
    OfficeComponent,
    OpinionComponent,
    ModalComponent,
    tablaModalComponent,
    ModalPersonaOficinaComponent,
    ListdocsComponent,
    TablaOficioModalComponent,
  ],
  imports: [
    CommonModule,
    TextChangeRoutingModule,
    SharedModule,
    TabsModule,

    UsersSharedComponent,
  ],
})
export class TextChangeModule {}
