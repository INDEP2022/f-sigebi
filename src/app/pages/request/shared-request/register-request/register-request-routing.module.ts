import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterRequestComponent } from './register-request.component';

const routes: Routes = [
  {
    path: ':layout/:type/:request',
    component: RegisterRequestComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterRequestRoutingModule {}
