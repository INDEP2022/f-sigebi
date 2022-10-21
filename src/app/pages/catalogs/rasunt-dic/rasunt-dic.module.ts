import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { RAsuntDicFormComponent } from './rasunt-dic-form/rasunt-dic-form.component';
import { RAsuntDicListComponent } from './rasunt-dic-list/rasunt-dic-list.component';
import { RAsuntDicRoutingModule } from './rasunt-dic-routing.module';

@NgModule({
  declarations: [RAsuntDicFormComponent, RAsuntDicListComponent],
  imports: [
    CommonModule,
    RAsuntDicRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class RAsuntDicModule {}
