import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { UnreconciledFilesRoutingModule } from './unreconciled-files-routing.module';
import { UnreconciledFilesComponent } from './unreconciled-files/unreconciled-files.component';

@NgModule({
  declarations: [UnreconciledFilesComponent],
  imports: [CommonModule, UnreconciledFilesRoutingModule],
})
export class UnreconciledFilesModule {}
