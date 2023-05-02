import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EconomicCompensationModule } from '../economic-compensation.module';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { SharedRequestModule } from '../../shared-request/shared-request.module';
import { ValidateDictumRoutingModule } from './validate-dictum-routing.module';
import { ValidateDictumComponent } from './validate-dictum/validate-dictum.component';

@NgModule({
  declarations: [ValidateDictumComponent],
  imports: [
    CommonModule,
    ValidateDictumRoutingModule,
    EconomicCompensationModule,
    SharedRequestModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    NgScrollbarModule,
  ],
})
export class ValidateDictumModule {}
