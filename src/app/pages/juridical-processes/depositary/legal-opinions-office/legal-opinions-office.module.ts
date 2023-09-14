import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CitiesSharedComponent } from 'src/app/@standalone/shared-forms/cities-shared/cities-shared.component';
import { UsersSharedComponent } from 'src/app/@standalone/shared-forms/user-shared/user-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LegalOpinionsOfficeFindAppointmentComponent } from './legal-opinions-office-find-appointment/legal-opinions-office-find-appointment.component';
import { LegalOpinionsOfficeFirmModalComponent } from './legal-opinions-office-firm-modal/legal-opinions-office-firm-modal.component';
import { LegalOpinionsOfficeRoutingModule } from './legal-opinions-office-routing.module';
import { LegalOpinionsOfficeComponent } from './legal-opinions-office/legal-opinions-office.component';
import { ModalScanningFoilTableComponent } from './modal-scanning-foil/modal-scanning-foil.component';
import { ScanningFoilComponent } from './scanning-foil/scanning-foil.component';

@NgModule({
  declarations: [
    LegalOpinionsOfficeComponent,
    ScanningFoilComponent,
    LegalOpinionsOfficeFindAppointmentComponent,
    LegalOpinionsOfficeFirmModalComponent,
    ModalScanningFoilTableComponent,
  ],
  imports: [
    CommonModule,
    LegalOpinionsOfficeRoutingModule,
    SharedModule,
    UsersSharedComponent,
    CitiesSharedComponent,
    TooltipModule.forRoot(),
  ],
})
export class LegalOpinionsOfficeModule {}
