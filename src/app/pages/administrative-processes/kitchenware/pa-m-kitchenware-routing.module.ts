import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaKCPropertyRegistrationComponent } from './pa-k-c-property-registration/pa-k-c-property-registration.component';

const routes: Routes = [
  {
    path: '',
    component: PaKCPropertyRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaMKitchenwareRoutingModule {}
