import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CBROimCReportsModalComponent } from './reports-modal/reports-modal.component';
import { SignatureAuxiliaryCatalogsMainComponent } from './signature-auxiliary-catalogs-main/signature-auxiliary-catalogs-main.component';
import { SignatureAuxiliaryCatalogsRoutingModule } from './signature-auxiliary-catalogs-routing.module';
import { TypesModalComponent } from './types-modal/types-modal.component';

@NgModule({
  declarations: [
    SignatureAuxiliaryCatalogsMainComponent,
    CBROimCReportsModalComponent,
    TypesModalComponent,
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
