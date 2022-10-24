import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { GranteesFormComponent } from './grantees-form/grantees-form.component';
import { GranteesListComponent } from './grantees-list/grantees-list.component';
import { GrateesRoutingModule } from './grantees-routing.module';

@NgModule({
  declarations: [GranteesListComponent, GranteesFormComponent],
  imports: [
    CommonModule,
    GrateesRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class GranteesModule {}
