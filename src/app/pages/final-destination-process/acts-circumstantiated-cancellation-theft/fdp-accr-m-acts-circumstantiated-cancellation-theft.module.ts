import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpAccrCActsCircumstantiatedCancellationTheftComponent } from './acts-circumstantiated-cancellation-theft/fdp-accr-c-acts-circumstantiated-cancellation-theft.component';
import { FdpAccrMActsCircumstantiatedCancellationTheftRoutingModule } from './fdp-accr-m-acts-circumstantiated-cancellation-theft-routing.module';

@NgModule({
  declarations: [FdpAccrCActsCircumstantiatedCancellationTheftComponent],
  imports: [
    CommonModule,
    FdpAccrMActsCircumstantiatedCancellationTheftRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class FdpAccrMActsCircumstantiatedCancellationTheftModule {}
