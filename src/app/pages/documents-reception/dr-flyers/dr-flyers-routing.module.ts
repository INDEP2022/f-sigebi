import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RdFDocumentsReceptionRegisterComponent } from './rd-f-documents-reception-register/rd-f-documents-reception-register.component';

const routes: Routes = [
  {
    path: '',
    component: RdFDocumentsReceptionRegisterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DrFlyersRoutingModule {}
