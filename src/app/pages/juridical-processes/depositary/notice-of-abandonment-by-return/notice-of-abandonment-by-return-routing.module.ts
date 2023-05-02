import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NoticeOfAbandonmentByReturnComponent } from './notice-of-abandonment-by-return/notice-of-abandonment-by-return.component';

const routes: Routes = [
  {
    path: '',
    component: NoticeOfAbandonmentByReturnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NoticeOfAbandonmentByReturnRoutingModule {}
