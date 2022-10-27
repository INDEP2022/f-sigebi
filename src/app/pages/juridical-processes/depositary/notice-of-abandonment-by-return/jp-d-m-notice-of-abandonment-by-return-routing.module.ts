import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JpDUcmCNoticeOfAbandonmentByReturnComponent } from './jp-d-ucm-c-notice-of-abandonment-by-return/jp-d-ucm-c-notice-of-abandonment-by-return.component';

const routes: Routes = [
  {
    path: '',
    component: JpDUcmCNoticeOfAbandonmentByReturnComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JpDMNoticeOfAbandonmentByReturnRoutingModule {}
