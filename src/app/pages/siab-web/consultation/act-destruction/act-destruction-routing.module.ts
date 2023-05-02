import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActDestructionComponent } from './act-destruction/act-destruction.component';

const routes: Routes = [
  {
    path: '',
    component: ActDestructionComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActDestructionRoutingModule {}
