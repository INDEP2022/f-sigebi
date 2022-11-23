import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GreCValidateDictumComponent } from './gre-c-validate-dictum/gre-c-validate-dictum.component';

const routes: Routes = [
  {
    path: ':request',
    component: GreCValidateDictumComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GreMValidateDictumRoutingModule {}
