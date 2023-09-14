import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BanksSharedComponent } from 'src/app/@standalone/shared-forms/banks-shared/banks-shared.component';
import { CurrencySharedComponent } from 'src/app/@standalone/shared-forms/currency-shared/currency-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from '../../../../shared/shared.module';
import { UnreconciledFilesRoutingModule } from './unreconciled-files-routing.module';
import { UnreconciledFilesComponent } from './unreconciled-files/unreconciled-files.component';

@NgModule({
  declarations: [UnreconciledFilesComponent],
  imports: [
    CommonModule,
    UnreconciledFilesRoutingModule,
    SharedModule,
    BanksSharedComponent,
    CurrencySharedComponent,
    DelegationSharedComponent,
    ReactiveFormsModule,
  ],
})
export class UnreconciledFilesModule {}
