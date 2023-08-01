import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationOfInterestModalComponent } from './registration-of-interest-modal/registration-of-interest-modal.component';

const routes: Routes = [
  //{ path: '', component: RegistrationOfInterestComponent },
  { path: '', component: RegistrationOfInterestModalComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationOfInterestRoutingModule {}
