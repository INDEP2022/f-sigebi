import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FindActaComponent } from './find-acta/find-acta.component';
import { ImplementationReportHistoricComponent } from './implementation-report-historic/implementation-report-historic.component';
import { ImplementationReportRoutingModule } from './implementation-report-routing.module';
import { ImplementationReportComponent } from './implementation-report/implementation-report.component';

@NgModule({
  declarations: [
    ImplementationReportComponent,
    ImplementationReportHistoricComponent,
    FindActaComponent,
  ],
  exports: [ImplementationReportHistoricComponent],
  imports: [
    CommonModule,
    FormLoaderComponent,
    ImplementationReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class ImplementationReportModule {}
