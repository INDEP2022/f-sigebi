import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';

import { JpDLooCLegalOpinionsOfficeComponent } from './jp-d-loo-c-legal-opinions-office/jp-d-loo-c-legal-opinions-office.component';
import { JpDMLegalOpinionsOfficeRoutingModule } from './jp-d-m-legal-opinions-office-routing.module';
import { ScanningFoilComponent } from './scanning-foil/scanning-foil.component';

@NgModule({
  declarations: [JpDLooCLegalOpinionsOfficeComponent, ScanningFoilComponent],
  imports: [CommonModule, JpDMLegalOpinionsOfficeRoutingModule, SharedModule],
})
export class JpDMLegalOpinionsOfficeModule {}
