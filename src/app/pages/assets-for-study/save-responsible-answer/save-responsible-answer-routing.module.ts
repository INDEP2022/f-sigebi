import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SaveAnswerComponent } from './save-answer/save-answer.component';

const routes: Routes = [
  {
    path: '',
    component: SaveAnswerComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SaveResponsibleAnswerRoutingModule {}
