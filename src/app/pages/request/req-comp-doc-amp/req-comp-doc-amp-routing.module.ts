import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReqCompDocAmpComponent } from './req-comp-doc-amp.component';

const routes: Routes = [
  {
    path: ':layout/:type/:request',
    component: ReqCompDocAmpComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReqCompDocAmpRoutingModule {}
