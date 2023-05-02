import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { EventTypesRoutingModule } from './event-types-routing.module';
//Components
import { EventTypesFornComponent } from './event-types-form/event-types-forn.component';
import { EventTypesComponent } from './event-types/event-types.component';

@NgModule({
  declarations: [EventTypesComponent, EventTypesFornComponent],
  imports: [
    CommonModule,
    EventTypesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class EventTypesModule {}
