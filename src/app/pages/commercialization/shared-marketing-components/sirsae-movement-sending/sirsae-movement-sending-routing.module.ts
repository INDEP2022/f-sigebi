import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SirsaeMovementSendingMainComponent } from './sirsae-movement-sending-main/sirsae-movement-sending-main.component';

const routes: Routes = [
  {
    path: ':goodType',
    component: SirsaeMovementSendingMainComponent,
    data: { screen: 'FCOMER112' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SirsaeMovementSendingRoutingModule {}
