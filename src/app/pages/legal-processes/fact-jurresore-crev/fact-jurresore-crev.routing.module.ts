import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactJurresoreCrevComponent } from './fact-jurresore-crev/fact-jurresore-crev.component';

const routes: Routes = [
  {
    path: '',
    component: FactJurresoreCrevComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactJurresoreCrevRoutingModule {}
