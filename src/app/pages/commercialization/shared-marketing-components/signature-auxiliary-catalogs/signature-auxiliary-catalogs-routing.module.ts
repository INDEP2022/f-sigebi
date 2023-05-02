import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignatureAuxiliaryCatalogsMainComponent } from './signature-auxiliary-catalogs-main/signature-auxiliary-catalogs-main.component';

const routes: Routes = [
  {
    path: ':property',
    component: SignatureAuxiliaryCatalogsMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SignatureAuxiliaryCatalogsRoutingModule {}
