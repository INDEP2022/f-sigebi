import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeliveriesConstancyFormComponent } from './deliveries-constancy-form/deliveries-constancy-form.component';
import { DocumentConstanceModalComponent } from './document-constance-modal/document-constance-modal.component';
import { ExecuteSchedulingDeliveriesComponent } from './execute-scheduling-deliveries/execute-scheduling-deliveries.component';
import { InputFieldComponent } from './execute-scheduling-deliveries/input-field/input-field.component';
import { NotificationDestructionFormComponent } from './notification-destruction-form/notification-destruction-form.component';
import { SchedulingDeliveriesFormComponent } from './scheduling-deliveries-form/scheduling-deliveries-form.component';
import { SchedulingDeliveriesRoutigModule } from './scheduling-deliveries-routing.module';
import { TypeDeliveryModelComponent } from './type-delivery-model/type-delivery-model.component';

@NgModule({
  declarations: [
    SchedulingDeliveriesFormComponent,
    ExecuteSchedulingDeliveriesComponent,
    DeliveriesConstancyFormComponent,
    InputFieldComponent,
    TypeDeliveryModelComponent,
    DocumentConstanceModalComponent,
    NotificationDestructionFormComponent,
  ],
  imports: [
    CommonModule,
    SchedulingDeliveriesRoutigModule,
    SharedModule,
    ModalModule.forRoot(),
  ],
})
export class SchedulingDeliveriesModule {}
