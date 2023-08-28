import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { automobilesComponent } from './automobiles/automobiles.component';

const routes: Routes = [
  {
    path: '',
    component: automobilesComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AutomobilesRoutingModule {}
