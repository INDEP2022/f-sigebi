import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { GpPurgingRecordsFormComponent } from './components/gp-purging-records-form/gp-purging-records-form.component';
import { GpPurgingRecordsTableComponent } from './components/gp-purging-records-table/gp-purging-records-table.component';
import { GpPurgingRecordsRoutingModule } from './gp-purging-records-routing.module';
import { GpPurgingRecordsComponent } from './gp-purging-records/gp-purging-records.component';

@NgModule({
  declarations: [
    GpPurgingRecordsComponent,
    GpPurgingRecordsFormComponent,
    GpPurgingRecordsTableComponent,
  ],
  imports: [CommonModule, GpPurgingRecordsRoutingModule, SharedModule],
})
export class GpPurgingRecordsModule {}
