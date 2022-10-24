import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FdpAcscMCircumstantialActsSuspensionCancellationRoutingModule } from './fdp-acsc-m-circumstantial-acts-suspension-cancellation-routing.module';
import { FdpAcscCCircumstantialActsSuspensionCancellationComponent } from './circumstantial-acts-suspension-cancellation/fdp-acsc-c-circumstantial-acts-suspension-cancellation.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FdpAcscCCircumstantialActsSuspensionCancellationComponent],
  imports: [
    CommonModule,
    FdpAcscMCircumstantialActsSuspensionCancellationRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class FdpAcscMCircumstantialActsSuspensionCancellationModule {}
