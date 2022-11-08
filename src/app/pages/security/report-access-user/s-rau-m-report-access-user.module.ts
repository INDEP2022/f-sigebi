/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { SRAUReportAccessUserRoutingModule } from './s-rau-m-report-access-user-routing.module';

/** COMPONENTS IMPORTS */
import { NgSelectModule } from '@ng-select/ng-select';
import { SRAUReportAccessUserComponent } from './report-access-user/s-rau-c-report-access-user.component';

@NgModule({
  declarations: [SRAUReportAccessUserComponent],
  imports: [
    CommonModule,
    SRAUReportAccessUserRoutingModule,
    SharedModule,
    NgSelectModule,
  ],
})
export class SRAUReportAccessUserModule {}
