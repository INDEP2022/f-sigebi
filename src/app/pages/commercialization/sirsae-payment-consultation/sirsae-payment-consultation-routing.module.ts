import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SirsaePaymentConsultationListComponent } from './sirsae-payment-consultation-list/sirsae-payment-consultation-list.component';

const routes: Routes = [
  {
    path: '',
    component: SirsaePaymentConsultationListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SirsaePaymentConsultationRoutingModule {}
