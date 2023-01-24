import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { GuidelinesFormComponent } from './guidelines-form/guidelines-form.component';
import { GuidelinesListComponent } from './guidelines-list/guidelines-list.component';
import { GuidelinesRoutingModule } from './guidelines-routing.module';

@NgModule({
  declarations: [GuidelinesListComponent, GuidelinesFormComponent],
  imports: [
    CommonModule,
    GuidelinesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class GuidelinesModule {}
