import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../shared/shared.module';
import { SharedRequestModule } from '../../request/shared-request/shared-request.module';
import { AssignmentListComponent } from './assignment-list/assignment-list.component';
import { SearchAssignmentListRoutingModule } from './search-assignment-list-routing.module';

@NgModule({
  declarations: [AssignmentListComponent],
  imports: [
    CommonModule,
    SearchAssignmentListRoutingModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forChild(),
    TabsModule.forRoot(),
    NgScrollbarModule,
    SharedModule,
    SharedRequestModule,
    TabsModule,
    HttpClientModule,
  ],
})
export class SearchAssignmentListModule {}
