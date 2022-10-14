import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { MinpubRoutingModule } from './minpub-routing.module';
import { MinpubListComponent } from './minpub-list/minpub-list.component';
import { MinpubFormComponent } from './minpub-form/minpub-form.component';

@NgModule({
  declarations: [MinpubListComponent, MinpubFormComponent],
  imports: [
    CommonModule,
    MinpubRoutingModule,
    ModalModule.forChild(),
    SharedModule,
  ],
})
export class MinpubModule {}
