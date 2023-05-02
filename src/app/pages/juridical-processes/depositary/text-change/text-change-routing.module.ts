import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TextChangeComponent } from './text-change/text-change.component';

const routes: Routes = [
  {
    path: '',
    component: TextChangeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TextChangeRoutingModule {}
