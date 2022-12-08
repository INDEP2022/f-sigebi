import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationOfInterestComponent } from './registration-of-interest.component';

const routes: Routes = [
  { path: '', component: RegistrationOfInterestComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationOfInterestRoutingModule {}
