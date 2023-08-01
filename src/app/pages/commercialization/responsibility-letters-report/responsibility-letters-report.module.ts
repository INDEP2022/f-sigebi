import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { DepartmentsSharedComponent } from 'src/app/@standalone/shared-forms/departments-shared/departments-shared.component';
import { FederativeSharedComponent } from 'src/app/@standalone/shared-forms/federative-shared/federative-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FindEventComponent } from './find-event/find-event.component';
import { FindRespLetterComponent } from './find-resp-letter/find-resp-letter.component';
import { ResponsibilityLettersReportRoutingModule } from './responsibility-letters-report-routing.module';
import { ResponsibilityLettersReportComponent } from './responsibility-letters-report.component';

@NgModule({
  declarations: [
    ResponsibilityLettersReportComponent,
    FindRespLetterComponent,
    FindEventComponent,
  ],
  imports: [
    CommonModule,
    FormLoaderComponent,
    ResponsibilityLettersReportRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    DelegationSharedComponent,
    FederativeSharedComponent,
    DepartmentsSharedComponent,
  ],
})
export class ResponsibilityLettersReportModule {}
