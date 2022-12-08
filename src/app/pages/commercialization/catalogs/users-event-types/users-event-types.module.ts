import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//@Standalone Components
import { EventTypeSharedComponent } from 'src/app/@standalone/shared-forms/event-type-shared/event-type-shared.component';
//Routing
import { UsersEventTypesRoutingModule } from './users-event-types-routing.module';
//Components
import { UsersEventTypesComponent } from './users-event-types/users-event-types.component';

@NgModule({
  declarations: [UsersEventTypesComponent],
  imports: [
    CommonModule,
    UsersEventTypesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EventTypeSharedComponent,
  ],
})
export class UsersEventTypesModule {}
