import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { UnreconciledFilesRoutingModule } from './unreconciled-files-routing.module';
import { UnreconciledFilesComponent } from './unreconciled-files/unreconciled-files.component';

@NgModule({
  declarations: [UnreconciledFilesComponent],
  imports: [
    CommonModule,
    UnreconciledFilesRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class UnreconciledFilesModule {}
