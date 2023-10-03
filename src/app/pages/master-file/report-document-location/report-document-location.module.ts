import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReportDocumentLocationRoutingModule } from './report-document-location-routing.module';
import { ReportDocumentLocationComponent } from './report-document-location/report-document-location.component';

@NgModule({
  declarations: [ReportDocumentLocationComponent],
  imports: [
    CommonModule,
    ReportDocumentLocationRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    DelegationSharedComponent,
  ],
})
export class ReportDocumentLocationModule {}
