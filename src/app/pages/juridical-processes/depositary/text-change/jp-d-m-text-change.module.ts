import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { JpDMTextChangeRoutingModule } from './jp-d-m-text-change-routing.module';
import { JpDTcCOfficeComponent } from './jp-d-tc-c-office/jp-d-tc-c-office.component';
import { JpDTcCOpinionComponent } from './jp-d-tc-c-opinion/jp-d-tc-c-opinion.component';
import { JpDTcCTextChangeComponent } from './jp-d-tc-c-text-change/jp-d-tc-c-text-change.component';

@NgModule({
  declarations: [
    JpDTcCTextChangeComponent,
    JpDTcCOfficeComponent,
    JpDTcCOpinionComponent,
  ],
  imports: [
    CommonModule,
    JpDMTextChangeRoutingModule,
    SharedModule,
    TabsModule,

    UsersSharedComponent,
  ],
})
export class JpDMTextChangeModule {}
