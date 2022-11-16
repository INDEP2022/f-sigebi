import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { CCEpMEventProcessRoutingModule } from './c-c-ep-m-event-process-routing.module';
//@Standalone Components
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
//Components
import { CCEplCEventProcessListComponent } from './event-process-list/c-c-epl-c-event-process-list.component';
import { CCEpfCEventProcessFormComponent } from './event-process-form/c-c-epf-c-event-process-form.component';


@NgModule({
  declarations: [
    CCEplCEventProcessListComponent,
    CCEpfCEventProcessFormComponent
  ],
  imports: [
    CommonModule,
    CCEpMEventProcessRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    BsDatepickerModule,
    ModalModule.forChild(),
    EventsSharedComponent
  ]
})
export class CCEpMEventProcessModule { }
