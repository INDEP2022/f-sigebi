import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValuesComponent } from './values/values.component';

const routes: Routes = [
  {
    path: '',
    component: ValuesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValuesRoutingModule {}
