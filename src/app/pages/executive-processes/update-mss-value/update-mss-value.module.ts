import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';

import { UpdateMssValueRoutingModule } from './update-mss-value-routing.module';
import { UpdateMssValueComponent } from './update-mss-value/update-mss-value.component';

@NgModule({
  declarations: [UpdateMssValueComponent],
  imports: [CommonModule, UpdateMssValueRoutingModule, SharedModule],
})
export class UpdateMssValueModule {}
