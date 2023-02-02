import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsiderationFormComponent } from './consideration-form/consideration-form.component';
import { ConsiderationsListComponent } from './considerations-list/considerations-list.component';
import { ConsiderationsRoutingModule } from './considerations-routing.module';

@NgModule({
  declarations: [ConsiderationsListComponent, ConsiderationFormComponent],
  imports: [
    CommonModule,
    ConsiderationsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ConsiderationsModule {}
