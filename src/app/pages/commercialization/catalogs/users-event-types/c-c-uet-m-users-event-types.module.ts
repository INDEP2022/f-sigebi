import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//@Standalone Components
import { EventTypeSharedComponent } from 'src/app/@standalone/shared-forms/event-type-shared/event-type-shared.component';
//Routing
import { CCUetMUsersEventTypesRoutingModule } from './c-c-uet-m-users-event-types-routing.module';
//Components
import { CCUetCUsersEventTypesComponent } from './users-event-types/c-c-uet-c-users-event-types.component';

@NgModule({
  declarations: [CCUetCUsersEventTypesComponent],
  imports: [
    CommonModule,
    CCUetMUsersEventTypesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    EventTypeSharedComponent,
  ],
})
export class CCUetMUsersEventTypesModule {}
