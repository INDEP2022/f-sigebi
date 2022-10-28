import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { CBROimCReportsModalComponent } from './c-b-r-oim-c-reports-modal/c-b-r-oim-c-reports-modal.component';
import { CBROimCSignatureAuxiliaryCatalogsMainComponent } from './c-b-r-oim-c-signature-auxiliary-catalogs-main/c-b-r-oim-c-signature-auxiliary-catalogs-main.component';
import { CBROimCTypesModalComponent } from './c-b-r-oim-c-types-modal/c-b-r-oim-c-types-modal.component';
import { CBROimMSigntureAuxiliaryCatalogsRoutingModule } from './c-b-r-oim-m-signture-auxiliary-catalogs-routing.module';

@NgModule({
  declarations: [
    CBROimCSignatureAuxiliaryCatalogsMainComponent,
    CBROimCReportsModalComponent,
    CBROimCTypesModalComponent,
  ],
  imports: [
    CommonModule,
    CBROimMSigntureAuxiliaryCatalogsRoutingModule,
    SharedModule,
    NgScrollbarModule,
    TabsModule.forRoot(),
    ModalModule.forChild(),
  ],
})
export class CBROimMSigntureAuxiliaryCatalogsModule {}
