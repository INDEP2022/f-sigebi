import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { SelectConceptSpentDialogComponent } from './components/select-concept-spent-dialog/select-concept-spent-dialog.component';
import { MassiveNumeraryChangeModalComponent } from './massive-numerary-change-modal/massive-numerary-change-modal.component';
import { MassiveNumeraryChangeRoutingModule } from './massive-numerary-change-routing.module';
import { MassiveNumeraryChangeComponent } from './massive-numerary-change/massive-numerary-change.component';

@NgModule({
  declarations: [
    MassiveNumeraryChangeComponent,
    MassiveNumeraryChangeModalComponent,
    SelectConceptSpentDialogComponent,
  ],
  imports: [
    CommonModule,
    MassiveNumeraryChangeRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class MassiveNumeraryChangeModule {}
