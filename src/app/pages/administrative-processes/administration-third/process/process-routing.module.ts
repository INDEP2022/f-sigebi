import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProcessComponent } from './process/process.component';

const routes: Routes = [
  {
    path: '',
    component: ProcessComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProcessRoutingModule {}
