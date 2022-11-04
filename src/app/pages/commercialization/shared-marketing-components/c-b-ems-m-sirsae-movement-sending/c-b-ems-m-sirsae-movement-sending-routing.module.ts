import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CBEmsCSirsaeMovementSendingMainComponent } from './c-b-ems-c-sirsae-movement-sending-main/c-b-ems-c-sirsae-movement-sending-main.component';

const routes: Routes = [
  {
    path: ':goodType',
    component: CBEmsCSirsaeMovementSendingMainComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBEmsMSirsaeMovementSendingRoutingModule { }
