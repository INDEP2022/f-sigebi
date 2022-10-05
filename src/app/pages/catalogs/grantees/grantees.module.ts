import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GrateesRoutingModule } from './grantees-routing.module';
import { GranteesListComponent } from './grantees-list/grantees-list.component';
import { GranteesFormComponent } from './grantees-form/grantees-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [
    GranteesListComponent,
    GranteesFormComponent
  ],
  imports: [
    CommonModule,
    GrateesRoutingModule,
    SharedModule,
    ModalModule.forChild()
  ]
})
export class GranteesModule { }
