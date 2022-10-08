import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CourtRoutingModule } from './court-routing.module';
import { CourtFormComponent } from './court-form/court-form.component';
import { CourtListComponent } from './court-list/court-list.component';


@NgModule({
  declarations: [
    CourtFormComponent,
    CourtListComponent
  ],
  imports: [
    CommonModule,
    CourtRoutingModule,
    SharedModule,
    ModalModule.forChild()
  ]
})
export class CourtModule { }
