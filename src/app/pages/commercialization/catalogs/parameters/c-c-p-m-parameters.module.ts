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
import { CCPMParametersRoutingModule } from './c-c-p-m-parameters-routing.module';
//Components
import { CCPfCParameterFormComponent } from './parameter-form/c-c-pf-c-parameter-form.component';
import { CCPlCParametersListComponent } from './parameter-list/c-c-pl-c-parameters-list.component';

@NgModule({
  declarations: [CCPlCParametersListComponent, CCPfCParameterFormComponent],
  imports: [
    CommonModule,
    CCPMParametersRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    ReactiveFormsModule,
    EventTypeSharedComponent,
  ],
})
export class CCPMParametersModule {}
