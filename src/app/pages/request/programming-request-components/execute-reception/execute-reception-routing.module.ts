import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecuteReceptionFormComponent } from './execute-reception-form/execute-reception-form.component';

const routes: Routes = [
  {
    path: '',
    component: ExecuteReceptionFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExecuteReceptionRoutingModule {}
