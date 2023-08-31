import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../shared-request/shared-request.module';
import { DeliveriesConstancyFormComponent } from './deliveries-constancy-form/deliveries-constancy-form.component';
import { DocumentConstanceModalComponent } from './document-constance-modal/document-constance-modal.component';
import { ExecuteSchedulingDeliveriesComponent } from './execute-scheduling-deliveries/execute-scheduling-deliveries.component';
import { InputFieldComponent } from './execute-scheduling-deliveries/input-field/input-field.component';
import { SelectFieldComponent } from './execute-scheduling-deliveries/select-field/select-field.component';
import { TextareaFieldComponent } from './execute-scheduling-deliveries/textarea-field/textarea-field.component';
import { TimeFieldComponent } from './execute-scheduling-deliveries/time-field/time-field.component';
import { TypeRestitutionFieldComponent } from './execute-scheduling-deliveries/type-restitution-field/type-restitution-field.component';
import { NotificationDestructionFormComponent } from './notification-destruction-form/notification-destruction-form.component';
import { NotificationDestructionFoundFormComponent } from './notification-destruction-found-form/notification-destruction-found-form.component';
import { PhotosConstanceModalComponent } from './photos-constance-modal/photos-constance-modal.component';
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
    TextareaFieldComponent,
    PhotosConstanceModalComponent,
    NotificationDestructionFormComponent,
    NotificationDestructionFoundFormComponent,
    SelectFieldComponent,
    TypeRestitutionFieldComponent,
    TimeFieldComponent,
  ],
  imports: [
    CommonModule,
    SchedulingDeliveriesRoutigModule,
    SharedModule,
    SharedRequestModule,
    ModalModule.forRoot(),
  ],
})
export class SchedulingDeliveriesModule {}
