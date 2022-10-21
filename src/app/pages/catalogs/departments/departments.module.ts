import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { DepartmentFormComponent } from './department-form/department-form.component';
import { DepartmentsListComponent } from './departments-list/departments-list.component';
import { DepartmentsRoutingModule } from './departments-routing.module';

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
