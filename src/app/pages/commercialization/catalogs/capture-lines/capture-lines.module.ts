import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { CaptureLinesRoutingModule } from './capture-lines-routing.module';
//Components
import { CaptureLinesMainComponent } from './capture-lines-main/capture-lines-main.component';
import { CaptureLinesComponent } from './capture-lines/capture-lines.component';
import { ExportCaptureLinesComponent } from './capture-lines/export-capture-lines/export-capture-lines.component';

@NgModule({
  declarations: [
    CaptureLinesMainComponent,
    CaptureLinesComponent,
    ExportCaptureLinesComponent,
  ],
  imports: [
    CommonModule,
    CaptureLinesRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
  ],
})
export class CaptureLinesModule {}
