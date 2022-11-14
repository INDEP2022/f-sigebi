import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CPCRegisterAttributesTypesComponent } from './c-p-c-register-attributes-types/c-p-c-register-attributes-types.component';

const routes: Routes = [
  {
    path: '',
    component: CPCRegisterAttributesTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CPMRegisterAttributesTypesRoutingModule {}
