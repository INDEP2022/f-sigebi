/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { PJFIAFCaptureFormalizingLawyersRoutingModule } from './pj-fi-af-m-capture-formalizing-lawyers-routing.module';

/** COMPONENTS IMPORTS */
import { PJFIAFCaptureFormalizingLawyersComponent } from './capture-formalizing-lawyers/pj-fi-af-c-capture-formalizing-lawyers.component';

@NgModule({
  declarations: [PJFIAFCaptureFormalizingLawyersComponent],
  imports: [
    CommonModule,
    PJFIAFCaptureFormalizingLawyersRoutingModule,
    SharedModule,
  ],
})
export class PJFIAFCaptureFormalizingLawyersModule {}
