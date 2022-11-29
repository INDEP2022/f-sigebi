import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CCMRegistrationOfInterestComponent } from './c-c-m-registration-of-interest.component';

const routes: Routes = [
  { path: '', component: CCMRegistrationOfInterestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CCMRegistrationOfInterestRoutingModule {}
