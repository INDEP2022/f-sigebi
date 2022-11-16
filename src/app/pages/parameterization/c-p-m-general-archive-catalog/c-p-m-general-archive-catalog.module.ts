import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { CPCGeneralArchiveCatalogComponent } from './c-p-c-general-archive-catalog/c-p-c-general-archive-catalog.component';
import { CPMGeneralArchiveCatalogRoutingModule } from './c-p-m-general-archive-catalog-routing.module';

@NgModule({
  declarations: [CPCGeneralArchiveCatalogComponent],
  imports: [
    CommonModule,
    CPMGeneralArchiveCatalogRoutingModule,
    SharedModule,
    UsersSharedComponent,
    DelegationSharedComponent,
  ],
})
export class CPMGeneralArchiveCatalogModule {}
