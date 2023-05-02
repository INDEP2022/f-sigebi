import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ResquestNumberingChangeComponent } from './resquest-numbering-change/resquest-numbering-change.component';

const routes: Routes = [
  {
    path: '',
    component: ResquestNumberingChangeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResquestNumberingChangeRoutingModule {}
