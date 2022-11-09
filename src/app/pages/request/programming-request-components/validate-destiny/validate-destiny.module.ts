import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from '../../../../shared/shared.module';
import { ValidateDestinyPhysicalAssetComponent } from './validate-destiny-physical-asset/validate-destiny-physical-asset.component';
import { ValidateDestinyRoutingModule } from './validate-destiny-routing.module';

@NgModule({
  declarations: [ValidateDestinyPhysicalAssetComponent],
  imports: [
    CommonModule,
    SharedModule,
    TabsModule,
    ModalModule.forChild(),
    ValidateDestinyRoutingModule,
  ],
})
export class ValidateDestinyModule {}
