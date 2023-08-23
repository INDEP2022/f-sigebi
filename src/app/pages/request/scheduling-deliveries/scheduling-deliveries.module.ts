import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeliveriesConstancyFormComponent } from './deliveries-constancy-form/deliveries-constancy-form.component';
import { ExecuteSchedulingDeliveriesComponent } from './execute-scheduling-deliveries/execute-scheduling-deliveries.component';
import { InputFieldComponent } from './execute-scheduling-deliveries/input-field/input-field.component';
import { SchedulingDeliveriesFormComponent } from './scheduling-deliveries-form/scheduling-deliveries-form.component';
import { SchedulingDeliveriesRoutigModule } from './scheduling-deliveries-routing.module';

@NgModule({
  declarations: [
    SchedulingDeliveriesFormComponent,
    ExecuteSchedulingDeliveriesComponent,
    DeliveriesConstancyFormComponent,
    InputFieldComponent,
  ],
  imports: [
    CommonModule,
    SchedulingDeliveriesRoutigModule,
    SharedModule,
    ModalModule.forRoot(),
  ],
})
export class SchedulingDeliveriesModule {}
