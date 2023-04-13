import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CitiesSharedComponent } from 'src/app/@standalone/shared-forms/cities-shared/cities-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { LegalOpinionsOfficeRoutingModule } from './legal-opinions-office-routing.module';
import { LegalOpinionsOfficeComponent } from './legal-opinions-office/legal-opinions-office.component';
import { ScanningFoilComponent } from './scanning-foil/scanning-foil.component';

@NgModule({
  declarations: [LegalOpinionsOfficeComponent, ScanningFoilComponent],
  imports: [
    CommonModule,
    LegalOpinionsOfficeRoutingModule,
    SharedModule,
    UsersSharedComponent,
    CitiesSharedComponent,
  ],
})
export class LegalOpinionsOfficeModule {}
