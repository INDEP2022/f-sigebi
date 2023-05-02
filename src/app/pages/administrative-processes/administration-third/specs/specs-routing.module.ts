import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpecsComponent } from './specs/specs.component';

const routes: Routes = [
  {
    path: '',
    component: SpecsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecsRoutingModule {}
