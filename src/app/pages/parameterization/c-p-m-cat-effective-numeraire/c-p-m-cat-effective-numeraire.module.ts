import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CPCCatEffectiveNumeraireModalComponent } from './c-p-c-cat-effective-numeraire-modal/c-p-c-cat-effective-numeraire-modal.component';
import { CPCCatEffectiveNumeraireComponent } from './c-p-c-cat-effective-numeraire/c-p-c-cat-effective-numeraire.component';
import { CPMCatEffectiveNumeraireRoutingModule } from './c-p-m-cat-effective-numeraire-routing.module';

@NgModule({
  declarations: [
    CPCCatEffectiveNumeraireComponent,
    CPCCatEffectiveNumeraireModalComponent,
  ],
  imports: [
    CommonModule,
    CPMCatEffectiveNumeraireRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CPMCatEffectiveNumeraireModule {}
