import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RAsuntDicRoutingModule } from './rasunt-dic-routing.module';
import { RAsuntDicFormComponent } from './rasunt-dic-form/rasunt-dic-form.component';
import { RAsuntDicListComponent } from './rasunt-dic-list/rasunt-dic-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
