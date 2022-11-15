import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCMnceAdmDepositoryAuditorComponent } from './c-p-c-mnce-adm-depository-auditor/c-p-c-mnce-adm-depository-auditor.component';

const routes: Routes = [
  {
    path: '',
    component: CPCMnceAdmDepositoryAuditorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMMnceAdmDepositoryAuditorRoutingModule {}
