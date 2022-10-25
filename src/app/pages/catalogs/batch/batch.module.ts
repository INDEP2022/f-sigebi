import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { BatchFormComponent } from './batch-form/batch-form.component';
import { BatchListComponent } from './batch-list/batch-list.component';
import { BatchRoutingModule } from './batch-routing.module';

@NgModule({
  declarations: [BatchListComponent, BatchFormComponent],
  imports: [
    CommonModule,
    BatchRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class BatchModule {}
