import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommercializationDestinationModalComponent } from './commercialization-destination-modal/commercialization-destination-modal.component';
import { CommercializationEventModalComponent } from './commercialization-event-modal/commercialization-event-modal.component';
import { CommercializationOriginsModalComponent } from './commercialization-origins-modal/commercialization-origins-modal.component';
import { CommercializationSignatureModalComponent } from './commercialization-signature-modal/commercialization-signature-modal.component';
import { CBROimCReportsModalComponent } from './reports-modal/reports-modal.component';
import { SignatureAuxiliaryCatalogsMainComponent } from './signature-auxiliary-catalogs-main/signature-auxiliary-catalogs-main.component';
import { SignatureAuxiliaryCatalogsRoutingModule } from './signature-auxiliary-catalogs-routing.module';
import { TypesModalComponent } from './types-modal/types-modal.component';

@NgModule({
  declarations: [
    SignatureAuxiliaryCatalogsMainComponent,
    CBROimCReportsModalComponent,
    TypesModalComponent,
    CommercializationOriginsModalComponent,
    CommercializationDestinationModalComponent,
    CommercializationEventModalComponent,
    CommercializationSignatureModalComponent,
  ],
  imports: [
    CommonModule,
    SignatureAuxiliaryCatalogsRoutingModule,
    SharedModule,
    NgScrollbarModule,
    TabsModule.forRoot(),
    ModalModule.forChild(),
  ],
})
export class SignatureAuxiliaryCatalogsModule {}
