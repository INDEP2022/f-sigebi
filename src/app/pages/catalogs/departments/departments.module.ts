import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { DepartmentsListComponent } from './departments-list/departments-list.component';
import { DepartmentFormComponent } from './department-form/department-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [DepartmentsListComponent, DepartmentFormComponent],
  imports: [
    CommonModule,
    DepartmentsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DepartmentsModule {}
