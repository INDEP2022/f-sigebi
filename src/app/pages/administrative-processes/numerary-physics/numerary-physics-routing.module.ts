import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NumeraryPhysicsComponent } from './numerary-physics/numerary-physics.component';

const routes: Routes = [
  {
    path: '',
    component: NumeraryPhysicsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NumeraryPhysicsRoutingModule {}
