import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VaultConsultationComponent } from './vault-consultation/vault-consultation.component';

const routes: Routes = [
  {
    path: '',
    component: VaultConsultationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VaultConsultationRoutingModule {}
