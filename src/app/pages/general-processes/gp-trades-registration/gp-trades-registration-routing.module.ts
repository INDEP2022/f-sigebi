import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GpTradesRegistrationComponent } from './gp-trades-registration/gp-trades-registration.component';

const routes: Routes = [
  {
    path: '',
    component: GpTradesRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GpTradesRegistrationRoutingModule {}
