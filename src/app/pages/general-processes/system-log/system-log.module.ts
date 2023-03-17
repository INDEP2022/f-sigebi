import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { LogTableComponent } from './components/log-table/log-table.component';
import { RegistersTableComponent } from './components/registers-table/registers-table.component';
import { SystemLogFieldComponent } from './components/system-log-field/system-log-field.component';
import { SystemLogFormComponent } from './components/system-log-form/system-log-form.component';
import { SystemLogRoutingModule } from './system-log-routing.module';
import { SystemLogComponent } from './system-log/system-log.component';

@NgModule({
  declarations: [
    SystemLogComponent,
    SystemLogFormComponent,
    SystemLogFieldComponent,
    RegistersTableComponent,
    LogTableComponent,
  ],
  imports: [CommonModule, SystemLogRoutingModule, SharedModule],
})
export class SystemLogModule {}
