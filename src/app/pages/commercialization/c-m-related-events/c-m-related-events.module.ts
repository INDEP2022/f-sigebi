import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CMRelatedEventsListComponent } from './c-m-related-events-list/c-m-related-events-list.component';
import { CMRelatedEventsRoutingModule } from './c-m-related-events-routing.module';
import { SelectRelatedEventComponent } from './components/select-related-event/select-related-event.component';

@NgModule({
  declarations: [CMRelatedEventsListComponent, SelectRelatedEventComponent],
  imports: [CommonModule, CMRelatedEventsRoutingModule, SharedModule],
})
export class CMRelatedEventsModule {}
