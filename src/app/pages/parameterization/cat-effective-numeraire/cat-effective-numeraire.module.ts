import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';

import { CatEffectiveNumeraireModalComponent } from './cat-effective-numeraire-modal/cat-effective-numeraire-modal.component';
import { CatEffectiveNumeraireRoutingModule } from './cat-effective-numeraire-routing.module';
import { CatEffectiveNumeraireComponent } from './cat-effective-numeraire/cat-effective-numeraire.component';

@NgModule({
  declarations: [
    CatEffectiveNumeraireComponent,
    CatEffectiveNumeraireModalComponent,
  ],
  imports: [
    CommonModule,
    CatEffectiveNumeraireRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatEffectiveNumeraireModule {}
