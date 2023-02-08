import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidateDictumComponent } from './validate-dictum/validate-dictum.component';

const routes: Routes = [
  {
    path: ':request',
    component: ValidateDictumComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateDictumRoutingModule {}
