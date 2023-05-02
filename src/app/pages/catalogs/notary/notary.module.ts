import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotaryFormComponent } from './notary-form/notary-form.component';
import { NotaryListComponent } from './notary-list/notary-list.component';
import { NotaryRoutingModule } from './notary-routing.module';

@NgModule({
  declarations: [NotaryFormComponent, NotaryListComponent],
  imports: [
    CommonModule,
    NotaryRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class NotaryModule {}
