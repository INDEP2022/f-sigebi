import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { BatchRoutingModule } from './batch-routing.module';
import { BatchListComponent } from './batch-list/batch-list.component';
import { BatchFormComponent } from './batch-form/batch-form.component';


@NgModule({
  declarations: [
    BatchListComponent,
    BatchFormComponent
  ],
  imports: [
    CommonModule,
    BatchRoutingModule,
    SharedModule,
    ModalModule.forChild()
  ]
})
export class BatchModule { }
