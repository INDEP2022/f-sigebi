import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CMRelatedEventsRoutingModule } from './c-m-related-events-routing.module';
import { CMRelatedEventsListComponent } from './c-m-related-events-list/c-m-related-events-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CMRelatedEventsListComponent],
  imports: [CommonModule, CMRelatedEventsRoutingModule, SharedModule],
})
export class CMRelatedEventsModule {}
