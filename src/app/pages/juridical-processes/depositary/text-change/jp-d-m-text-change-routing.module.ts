import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDTcCTextChangeComponent } from './jp-d-tc-c-text-change/jp-d-tc-c-text-change.component';

const routes: Routes = [
  {
    path: '',
    component: JpDTcCTextChangeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMTextChangeRoutingModule {}
