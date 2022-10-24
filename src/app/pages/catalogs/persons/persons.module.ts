import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { PersonFormComponent } from './person-form/person-form.component';
import { PersonListComponent } from './person-list/person-list.component';
import { PersonsRoutingModule } from './persons-routing.module';

@NgModule({
  declarations: [PersonFormComponent, PersonListComponent],
  imports: [
    CommonModule,
    PersonsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class PersonsModule {}
