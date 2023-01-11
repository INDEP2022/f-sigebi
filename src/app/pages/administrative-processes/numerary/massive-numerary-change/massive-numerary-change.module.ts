import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { MassiveNumeraryChangeModalComponent } from './massive-numerary-change-modal/massive-numerary-change-modal.component';
import { MassiveNumeraryChangeRoutingModule } from './massive-numerary-change-routing.module';
import { MassiveNumeraryChangeComponent } from './massive-numerary-change/massive-numerary-change.component';

@NgModule({
  declarations: [
    MassiveNumeraryChangeComponent,
    MassiveNumeraryChangeModalComponent,
  ],
  imports: [
    CommonModule,
    MassiveNumeraryChangeRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class MassiveNumeraryChangeModule {}
