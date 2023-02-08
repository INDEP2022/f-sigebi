import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { PurgingRecordsFormComponent } from './components/purging-records-form/purging-records-form.component';
import { PurgingRecordsTableComponent } from './components/purging-records-table/purging-records-table.component';
import { PurgingRecordsRoutingModule } from './purging-records-routing.module';
import { PurgingRecordsComponent } from './purging-records/purging-records.component';

@NgModule({
  declarations: [
    PurgingRecordsComponent,
    PurgingRecordsFormComponent,
    PurgingRecordsTableComponent,
  ],
  imports: [CommonModule, PurgingRecordsRoutingModule, SharedModule],
})
export class PurgingRecordsModule {}
