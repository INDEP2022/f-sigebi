import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CourtFormComponent } from './court-form/court-form.component';
import { CourtListComponent } from './court-list/court-list.component';
import { CourtRoutingModule } from './court-routing.module';

@NgModule({
  declarations: [CourtFormComponent, CourtListComponent],
  imports: [
    CommonModule,
    CourtRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CourtModule {}
