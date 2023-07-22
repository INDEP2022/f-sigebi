import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../shared-request/shared-request.module';
//Routing
import { RequestCompDocFormComponent } from './request-comp-doc-form/request-comp-doc-form.component';
//Components
import { RequestCompDocTasksComponent } from './request-comp-doc-tasks/request-comp-doc-tasks.component';
import { RequestComplementaryDocumentationRoutingModule } from './request-complementary-documentation-routing.module';

@NgModule({
  declarations: [RequestCompDocFormComponent, RequestCompDocTasksComponent],
  imports: [
    CommonModule,
    RequestComplementaryDocumentationRoutingModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class RequestComplementaryDocumentationModule {}
