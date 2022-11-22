import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { EconomicCompensationModule } from '../economic-compensation.module';
import { GreCCompensationActMainComponent } from './gre-c-compensation-act-main/gre-c-compensation-act-main.component';
import { GreMCompensationActRoutingModule } from './gre-m-compensation-act-routing.module';

@NgModule({
  declarations: [GreCCompensationActMainComponent],
  imports: [
    CommonModule,
    GreMCompensationActRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
  ],
})
export class GreMCompensationActModule {}
