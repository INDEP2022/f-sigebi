import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { GuidelinesRevisionMainComponent } from './guidelines-revision-main/guidelines-revision-main.component';
import { GuidelinesRevisionRoutingModule } from './guidelines-revision-routing.module';

@NgModule({
  declarations: [GuidelinesRevisionMainComponent],
  imports: [
    CommonModule,
    GuidelinesRevisionRoutingModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class GuidelinesRevisionModule {}
