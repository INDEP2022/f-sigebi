import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//@Standalone Components
import { EventTypeSharedComponent } from 'src/app/@standalone/shared-forms/event-type-shared/event-type-shared.component';
//Routing
import { ParametersRoutingModule } from './parameters-routing.module';
//Components
import { ParametersFormComponent } from './parameters-form/parameters-form.component';
import { ParametersListComponent } from './parameters-list/parameters-list.component';

@NgModule({
  declarations: [ParametersListComponent, ParametersFormComponent],
  imports: [
    CommonModule,
    ParametersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    ReactiveFormsModule,
    EventTypeSharedComponent,
  ],
})
export class ParametersModule {}
