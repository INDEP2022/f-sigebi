import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EconomicCompensationModule } from '../economic-compensation.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { GreCValidateDictumComponent } from './gre-c-validate-dictum/gre-c-validate-dictum.component';
import { GreMValidateDictumRoutingModule } from './gre-m-validate-dictum-routing.module';

@NgModule({
  declarations: [GreCValidateDictumComponent],
  imports: [
    CommonModule,
    GreMValidateDictumRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    NgScrollbarModule,
  ],
})
export class GreMValidateDictumModule {}
