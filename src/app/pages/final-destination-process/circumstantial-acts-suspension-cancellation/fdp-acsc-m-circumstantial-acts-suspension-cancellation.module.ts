import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { FdpAcscCCircumstantialActsSuspensionCancellationComponent } from './circumstantial-acts-suspension-cancellation/fdp-acsc-c-circumstantial-acts-suspension-cancellation.component';
import { FdpAcscMCircumstantialActsSuspensionCancellationRoutingModule } from './fdp-acsc-m-circumstantial-acts-suspension-cancellation-routing.module';

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
