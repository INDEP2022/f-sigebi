import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CBROimMSigntureAuxiliaryCatalogsRoutingModule } from './c-b-r-oim-m-signture-auxiliary-catalogs-routing.module';
import { CBROimCSignatureAuxiliaryCatalogsMainComponent } from './c-b-r-oim-c-signature-auxiliary-catalogs-main/c-b-r-oim-c-signature-auxiliary-catalogs-main.component';


@NgModule({
  declarations: [
    CBROimCSignatureAuxiliaryCatalogsMainComponent
  ],
  imports: [
    CommonModule,
    CBROimMSigntureAuxiliaryCatalogsRoutingModule
  ]
})
export class CBROimMSigntureAuxiliaryCatalogsModule { }
