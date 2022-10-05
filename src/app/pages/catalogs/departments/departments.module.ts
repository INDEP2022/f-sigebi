import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { DepartmentsListComponent } from './departments-list/departments-list.component';
import { DepartmentFormComponent } from './department-form/department-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';

@NgModule({
  declarations: [DepartmentsListComponent, DepartmentFormComponent],
  imports: [
    CommonModule,
    DepartmentsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  providers: [DepartamentService],
})
export class DepartmentsModule {}
