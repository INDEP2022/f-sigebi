import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module';
import { VaultsRoutingModule } from './vaults-routing.module';
import { VaultsComponent } from './vaults/vaults.component';

@NgModule({
  declarations: [VaultsComponent],
  imports: [CommonModule, VaultsRoutingModule, SharedModule],
})
export class VaultsModule {}
