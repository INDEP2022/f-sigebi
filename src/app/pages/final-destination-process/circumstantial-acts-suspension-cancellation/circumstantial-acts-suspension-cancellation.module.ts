import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ScanFileSharedComponent } from 'src/app/@standalone/shared-forms/scan-file-shared/scan-file-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CircumstantialActsSuspensionCancellationRoutingModule } from './circumstantial-acts-suspension-cancellation-routing.module';
import { CircumstantialActsSuspensionCancellationComponent } from './circumstantial-acts-suspension-cancellation/circumstantial-acts-suspension-cancellation.component';
import { ReceptionDeliveryComponent } from './reception-delivery/reception-delivery.component';

@NgModule({
  declarations: [
    CircumstantialActsSuspensionCancellationComponent,
    ReceptionDeliveryComponent,
  ],
  imports: [
    CommonModule,
    CircumstantialActsSuspensionCancellationRoutingModule,
    SharedModule,
    FormsModule,
    ScanFileSharedComponent,
  ],
})
export class CircumstantialActsSuspensionCancellationModule {}
