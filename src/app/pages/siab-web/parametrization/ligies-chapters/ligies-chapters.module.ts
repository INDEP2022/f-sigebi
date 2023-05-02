import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { LigiesChaptersFormComponent } from './ligies-chapters-form/ligies-chapters-form.component';
import { LigiesChaptersRoutingModule } from './ligies-chapters-routing.module';
import { LigiesChaptersComponent } from './ligies-chapters/ligies-chapters.component';

@NgModule({
  declarations: [LigiesChaptersComponent, LigiesChaptersFormComponent],
  imports: [
    CommonModule,
    LigiesChaptersRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class LigiesChaptersModule {}
