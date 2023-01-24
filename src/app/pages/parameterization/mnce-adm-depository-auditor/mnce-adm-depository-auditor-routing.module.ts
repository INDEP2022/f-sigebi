import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MnceAdmDepositoryAuditorComponent } from './mnce-adm-depository-auditor/mnce-adm-depository-auditor.component';

const routes: Routes = [
  {
    path: '',
    component: MnceAdmDepositoryAuditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MnceAdmDepositoryAuditorRoutingModule {}
