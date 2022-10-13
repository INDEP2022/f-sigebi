import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaVcCVaultConsultationComponent } from './pa-vc-c-vault-consultation/pa-vc-c-vault-consultation.component';

const routes: Routes = [
  {
    path:'',
    component: PaVcCVaultConsultationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaMVaultConsultationRoutingModule { }
