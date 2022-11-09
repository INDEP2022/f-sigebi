import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Routing
import { CCEtMEventTypesRoutingModule } from './c-c-et-m-event-types-routing.module';
//Components
import { CCEtCEventTypesComponent } from './event-types/c-c-et-c-event-types.component';

@NgModule({
  declarations: [CCEtCEventTypesComponent],
  imports: [CommonModule, CCEtMEventTypesRoutingModule, SharedModule],
})
export class CCEtMEventTypesModule {}
