import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { MasterFileRoutingModule } from './master-file-routing.module';

@NgModule({
  declarations: [],
  imports: [CommonModule, MasterFileRoutingModule, SharedModule],
})
export class MasterFileModule {}
