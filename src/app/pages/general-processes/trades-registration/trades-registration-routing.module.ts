import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TradesRegistrationComponent } from './trades-registration/trades-registration.component';

const routes: Routes = [
  {
    path: '',
    component: TradesRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TradesRegistrationRoutingModule {}
