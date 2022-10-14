import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotaryRoutingModule } from './notary-routing.module';
import { NotaryFormComponent } from './notary-form/notary-form.component';
import { NotaryListComponent } from './notary-list/notary-list.component';

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
