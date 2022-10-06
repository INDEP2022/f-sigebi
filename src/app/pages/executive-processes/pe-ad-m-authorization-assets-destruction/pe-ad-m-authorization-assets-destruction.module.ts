import { NgModule } from '@angular/core'; 
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { PeAdMAuthorizationAssetsDestructionRoutingModule } from './pe-ad-m-authorization-assets-destruction-routing.module';
import { PeAdCAuthorizationAssetsDestructionComponent } from './pe-ad-c-authorization-assets-destruction/pe-ad-c-authorization-assets-destruction.component';


@NgModule({
  declarations: [
    PeAdCAuthorizationAssetsDestructionComponent
  ],
  imports: [
    CommonModule,
    PeAdMAuthorizationAssetsDestructionRoutingModule,
    SharedModule,
    Ng2SmartTableModule,
    BsDatepickerModule
  ]
})
export class PeAdMAuthorizationAssetsDestructionModule { }
