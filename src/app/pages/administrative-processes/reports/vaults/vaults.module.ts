import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VaultsRoutingModule } from './vaults-routing.module';
import { VaultsComponent } from './vaults/vaults.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    VaultsComponent
  ],
  imports: [
    CommonModule,
    VaultsRoutingModule,
    SharedModule,
  ]
})
export class VaultsModule { }
