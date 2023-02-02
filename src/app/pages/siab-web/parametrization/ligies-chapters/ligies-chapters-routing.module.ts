import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LigiesChaptersComponent } from './ligies-chapters/ligies-chapters.component';

const routes: Routes = [
  {
    path: '',
    component: LigiesChaptersComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LigiesChaptersRoutingModule {}
