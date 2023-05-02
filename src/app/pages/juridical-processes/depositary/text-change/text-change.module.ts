import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { OfficeComponent } from './office/office.component';
import { OpinionComponent } from './opinion/opinion.component';
import { TextChangeRoutingModule } from './text-change-routing.module';
import { TextChangeComponent } from './text-change/text-change.component';

@NgModule({
  declarations: [TextChangeComponent, OfficeComponent, OpinionComponent],
  imports: [
    CommonModule,
    TextChangeRoutingModule,
    SharedModule,
    TabsModule,

    UsersSharedComponent,
  ],
})
export class TextChangeModule {}
