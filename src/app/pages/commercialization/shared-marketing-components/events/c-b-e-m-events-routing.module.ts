import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import { CBEpcCEventPermissionControlComponent } from './event-permission-control/c-b-epc-c-event-permission-control.component';

const routes: Routes = [
  {
    path: '',
    component: CBEpcCEventPermissionControlComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CBEMEventsRoutingModule {}
