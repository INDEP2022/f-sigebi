import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyRegistrationComponent } from './property-registration/property-registration.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KitchenwareRoutingModule {}
