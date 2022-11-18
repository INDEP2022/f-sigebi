import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreCRegisterAppointmentMainComponent } from './gre-c-register-appointment-main/gre-c-register-appointment-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: GreCRegisterAppointmentMainComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
exports: [RouterModule]
})
export class GreMRegisterAppointmentRoutingModule { }
