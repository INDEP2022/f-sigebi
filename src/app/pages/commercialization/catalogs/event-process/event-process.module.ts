import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { EventProcessRoutingModule } from './event-process-routing.module';
//@Standalone Components
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
//Components
import { EventProcessFormComponent } from './event-process-form/event-process-form.component';
import { EventProcessListComponent } from './event-process-list/event-process-list.component';

@NgModule({
  declarations: [EventProcessListComponent, EventProcessFormComponent],
  imports: [
    CommonModule,
    EventProcessRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    EventsSharedComponent,
  ],
})
export class EventProcessModule {}
