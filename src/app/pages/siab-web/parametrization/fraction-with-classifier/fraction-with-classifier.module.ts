import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { FractionWithClassifierFormComponent } from './fraction-with-classifier-form/fraction-with-classifier-form.component';
import { FractionWithClassifierListComponent } from './fraction-with-classifier-list/fraction-with-classifier-list.component';
import { FractionWithClassifierRoutingModule } from './fraction-with-classifier-routing.module';

@NgModule({
  declarations: [
    FractionWithClassifierListComponent,
    FractionWithClassifierFormComponent,
  ],
  imports: [
    CommonModule,
    FractionWithClassifierRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class FractionWithClassifierModule {}
