import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticeAbandonmentForSecuringComponent } from './notice-abandonment-for-securing/notice-abandonment-for-securing.component';

const routes: Routes = [
  {
    path: '',
    component: NoticeAbandonmentForSecuringComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticeAbandonmentForSecuringRoutingModule {}
