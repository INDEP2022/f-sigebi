import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { SystemLogRoutingModule } from './system-log-routing.module';
import { SystemLogComponent } from './system-log/system-log.component';

@NgModule({
  declarations: [SystemLogComponent],
  imports: [CommonModule, SystemLogRoutingModule, SharedModule],
})
export class SystemLogModule {}
