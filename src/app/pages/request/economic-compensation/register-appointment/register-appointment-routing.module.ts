import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterAppointmentMainComponent } from './register-appointment-main/register-appointment-main.component';

const routes: Routes = [
  {
    path: ':request',
    component: RegisterAppointmentMainComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterAppointmentRoutingModule {}
