import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { SelectRelatedEventComponent } from './components/select-related-event/select-related-event.component';
import { RelatedEventsListComponent } from './related-events-list/related-events-list.component';
import { RelatedEventsRoutingModule } from './related-events-routing.module';

@NgModule({
  declarations: [RelatedEventsListComponent, SelectRelatedEventComponent],
  imports: [CommonModule, RelatedEventsRoutingModule, SharedModule],
})
export class RelatedEventsModule {}
