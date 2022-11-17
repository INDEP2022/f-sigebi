import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { CCEtMEventTypesRoutingModule } from './c-c-et-m-event-types-routing.module';
//Components
import { CCEtfCEventTypesFornComponent } from './event-types-form/c-c-etf-c-event-types-forn.component';
import { CCEtCEventTypesComponent } from './event-types/c-c-et-c-event-types.component';

@NgModule({
  declarations: [CCEtCEventTypesComponent, CCEtfCEventTypesFornComponent],
  imports: [
    CommonModule,
    CCEtMEventTypesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class CCEtMEventTypesModule {}
