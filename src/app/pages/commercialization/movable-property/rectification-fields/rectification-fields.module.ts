import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { RectificationFieldsRoutingModule } from './rectification-fields-routing.module';
import { RectificationFieldsComponent } from './rectification-fields/rectification-fields.component';

@NgModule({
  declarations: [RectificationFieldsComponent],
  imports: [CommonModule, RectificationFieldsRoutingModule, SharedModule],
})
export class RectificationFieldsModule {}
