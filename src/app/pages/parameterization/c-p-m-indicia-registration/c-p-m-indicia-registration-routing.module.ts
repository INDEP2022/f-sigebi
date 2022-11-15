import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPIrCIndiciaRegistrationComponent } from './c-p-ir-c-indicia-registration/c-p-ir-c-indicia-registration.component';

const routes: Routes = [
  {
    path: '',
    component: CPIrCIndiciaRegistrationComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMIndiciaRegistrationRoutingModule {}
