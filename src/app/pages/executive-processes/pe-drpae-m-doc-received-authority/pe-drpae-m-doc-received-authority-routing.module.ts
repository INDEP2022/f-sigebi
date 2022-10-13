import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PeDrpaeCDocReceivedAuthorityComponent } from './pe-drpae-c-doc-received-authority/pe-drpae-c-doc-received-authority.component';

const routes: Routes = [
  {
    path: '',
    component: PeDrpaeCDocReceivedAuthorityComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PeDrpaeMDocReceivedAuthorityRoutingModule { }
