import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { CCEtMEventTypesRoutingModule } from './c-c-et-m-event-types-routing.module';
//Components
import { CCEtCEventTypesComponent } from './event-types/c-c-et-c-event-types.component';


@NgModule({
  declarations: [
    CCEtCEventTypesComponent
  ],
  imports: [
    CommonModule,
    CCEtMEventTypesRoutingModule,
    SharedModule
  ]
})
export class CCEtMEventTypesModule { }
