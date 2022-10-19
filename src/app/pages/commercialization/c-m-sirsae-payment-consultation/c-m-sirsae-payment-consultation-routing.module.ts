import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CMSirsaePaymentConsultationListComponent } from './c-m-sirsae-payment-consultation-list/c-m-sirsae-payment-consultation-list.component';

const routes: Routes = [
  {
    path: '',
    component: CMSirsaePaymentConsultationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CMSirsaePaymentConsultationRoutingModule {}
