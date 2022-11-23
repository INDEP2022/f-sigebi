import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../shared-request/shared-request.module';
//Routing
import { RequestCompDocFormComponent } from './request-comp-doc-form/request-comp-doc-form.component';
import { RequestCompDocListComponent } from './request-comp-doc-list/request-comp-doc-list.component';
import { RequestComplementaryDocumentationRoutingModule } from './request-complementary-documentation-routing.module';

@NgModule({
  declarations: [RequestCompDocListComponent, RequestCompDocFormComponent],
  imports: [
    CommonModule,
    RequestComplementaryDocumentationRoutingModule,
    SharedRequestModule,
    SharedModule,
  ],
})
export class RequestComplementaryDocumentationModule {}
