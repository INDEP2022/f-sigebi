import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from '../../../shared/shared.module';
import { MinpubFormComponent } from './minpub-form/minpub-form.component';
import { MinpubListComponent } from './minpub-list/minpub-list.component';
import { MinpubRoutingModule } from './minpub-routing.module';

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
