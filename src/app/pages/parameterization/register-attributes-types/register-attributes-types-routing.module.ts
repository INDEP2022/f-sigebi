import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterAttributesTypesComponent } from './register-attributes-types/register-attributes-types.component';

const routes: Routes = [
  {
    path: '',
    component: RegisterAttributesTypesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterAttributesTypesRoutingModule {}
