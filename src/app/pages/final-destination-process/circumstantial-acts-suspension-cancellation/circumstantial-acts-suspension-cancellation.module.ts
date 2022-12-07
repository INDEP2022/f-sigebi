import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { CircumstantialActsSuspensionCancellationRoutingModule } from './circumstantial-acts-suspension-cancellation-routing.module';
import { CircumstantialActsSuspensionCancellationComponent } from './circumstantial-acts-suspension-cancellation/circumstantial-acts-suspension-cancellation.component';

@NgModule({
  declarations: [CircumstantialActsSuspensionCancellationComponent],
  imports: [
    CommonModule,
    CircumstantialActsSuspensionCancellationRoutingModule,
    SharedModule,
    FormsModule,
  ],
})
export class CircumstantialActsSuspensionCancellationModule {}
