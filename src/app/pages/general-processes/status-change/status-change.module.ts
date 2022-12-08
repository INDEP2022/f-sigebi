import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { StatusChangeRoutingModule } from './status-change-routing.module';
import { StatusChangeComponent } from './status-change/status-change.component';

@NgModule({
  declarations: [StatusChangeComponent],
  imports: [CommonModule, StatusChangeRoutingModule, SharedModule],
})
export class StatusChangeModule {}
