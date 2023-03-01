import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { EventsRoutingModule } from './events-routing.module';
//Components
import { EventPermissionControlComponent } from './event-permission-control/event-permission-control.component';
//@Standalone Components
import { EventsSharedComponent } from 'src/app/@standalone/shared-forms/events-shared/events-shared.component';
import { EvenPermissionControlModalComponent } from './even-permission-control-modal/even-permission-control-modal.component';

@NgModule({
  declarations: [
    EventPermissionControlComponent,
    EvenPermissionControlModalComponent,
  ],
  imports: [
    CommonModule,
    EventsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EventsSharedComponent,
  ],
})
export class EventsModule {}
