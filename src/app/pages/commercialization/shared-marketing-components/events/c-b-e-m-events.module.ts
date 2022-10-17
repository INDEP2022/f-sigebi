import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { CBEMEventsRoutingModule } from './c-b-e-m-events-routing.module';
//Components
import { CBEpcCEventPermissionControlComponent } from './event-permission-control/c-b-epc-c-event-permission-control.component';
//@Standalone Components
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';

@NgModule({
  declarations: [CBEpcCEventPermissionControlComponent],
  imports: [
    CommonModule,
    CBEMEventsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EventsSharedComponent,
  ],
})
export class CBEMEventsModule {}
