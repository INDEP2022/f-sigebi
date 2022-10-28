import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBROimCSignatureAuxiliaryCatalogsMainComponent } from './c-b-r-oim-c-signature-auxiliary-catalogs-main/c-b-r-oim-c-signature-auxiliary-catalogs-main.component';

const routes: Routes = [
  {
    path: '',
    component: CBROimCSignatureAuxiliaryCatalogsMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBROimMSigntureAuxiliaryCatalogsRoutingModule {}
