import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule } from '@angular/forms';
//NgxBootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//@Standalone Components
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { EventTypeSharedComponent } from 'src/app/@standalone/shared-forms/event-type-shared/event-type-shared.component';
//Components
import { DatePickerComponent } from './date-picker/date-picker.component';
import { SelectDescriptionComponent } from './entity-classification/select-description/select-description.component';
import { SelectIdComponent } from './entity-classification/select-id/select-id.component';
import { SelectUserComponent } from './select-user/select-user.component';
import { SelectEventTypeComponent } from './select-event-type/select-event-type.component';

@NgModule({
  declarations: [
    SelectUserComponent,
    DatePickerComponent,
    SelectIdComponent,
    SelectDescriptionComponent,
    SelectEventTypeComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    BsDatepickerModule,
    UsersSharedComponent,
    EventTypeSharedComponent
  ],
})
export class RenderComponentsModule {}
