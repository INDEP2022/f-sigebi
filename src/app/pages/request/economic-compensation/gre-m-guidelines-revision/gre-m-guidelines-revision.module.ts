import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { GreCGuidelinesRevisionMainComponent } from './gre-c-guidelines-revision-main/gre-c-guidelines-revision-main.component';
import { GreMGuidelinesRevisionRoutingModule } from './gre-m-guidelines-revision-routing.module';

@NgModule({
  declarations: [GreCGuidelinesRevisionMainComponent],
  imports: [
    CommonModule,
    GreMGuidelinesRevisionRoutingModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class GreMGuidelinesRevisionModule {}
