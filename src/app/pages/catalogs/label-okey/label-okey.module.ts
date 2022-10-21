import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { LabelOkeyFormComponent } from './label-okey-form/label-okey-form.component';
import { LabelOkeyListComponent } from './label-okey-list/label-okey-list.component';
import { LabelOkeyRoutingModule } from './label-okey-routing.module';
@NgModule({
  declarations: [LabelOkeyListComponent, LabelOkeyFormComponent],
  imports: [
    CommonModule,
    LabelOkeyRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class LabelOkeyModule {}
