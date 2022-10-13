import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';

import { CBmGeCdcTcMThirdPartyMarketersRoutingModule } from './c-bm-ge-cdc-tc-m-third-party-marketers-routing.module';
import { CBmGeCdcTcCThirdPartyMarketersComponent } from './c-bm-ge-cdc-tc-c-third-party-marketers/c-bm-ge-cdc-tc-c-third-party-marketers.component';


@NgModule({
  declarations: [
    CBmGeCdcTcCThirdPartyMarketersComponent
  ],
  imports: [
    CommonModule,
    CBmGeCdcTcMThirdPartyMarketersRoutingModule,
    SharedModule
  ]
})
export class CBmGeCdcTcMThirdPartyMarketersModule { }
