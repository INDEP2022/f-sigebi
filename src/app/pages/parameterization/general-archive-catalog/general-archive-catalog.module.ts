import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';

import { GeneralArchiveCatalogRoutingModule } from './general-archive-catalog-routing.module';
import { GeneralArchiveCatalogComponent } from './general-archive-catalog/general-archive-catalog.component';

@NgModule({
  declarations: [GeneralArchiveCatalogComponent],
  imports: [
    CommonModule,
    GeneralArchiveCatalogRoutingModule,
    SharedModule,
    UsersSharedComponent,
    DelegationSharedComponent,
  ],
})
export class GeneralArchiveCatalogModule {}
