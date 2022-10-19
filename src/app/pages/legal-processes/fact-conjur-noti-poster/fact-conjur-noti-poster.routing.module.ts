import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FactConjurNotiPosterComponent } from './fact-conjur-noti-poster/fact-conjur-noti-poster.component';

const routes: Routes = [
  {
    path: '',
    component: FactConjurNotiPosterComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FactConjurNotiPosterRoutingModule {}
