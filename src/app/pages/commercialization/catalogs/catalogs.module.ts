import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogsRoutingModule } from './catalogs-routing.module';
import { EventSelectionModalComponent } from './components/event-selection-modal/event-selection-modal.component';

@NgModule({
  declarations: [EventSelectionModalComponent],
  imports: [CommonModule, CatalogsRoutingModule, SharedModule],
  exports: [EventSelectionModalComponent],
})
export class CatalogsModule {}
