/** BASE IMPORT */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
/** BASE IMPORT */

/** LIBRERIAS EXTERNAS IMPORTS */

/** SERVICE IMPORTS */

/** ROUTING MODULE */
import { ReportAccessUserRoutingModule } from './report-access-user-routing.module';

/** COMPONENTS IMPORTS */
import { NgSelectModule } from '@ng-select/ng-select';
import { ReportAccessUserComponent } from './report-access-user/report-access-user.component';

@NgModule({
  declarations: [ReportAccessUserComponent],
  imports: [
    CommonModule,
    ReportAccessUserRoutingModule,
    SharedModule,
    NgSelectModule,
  ],
})
export class ReportAccessUserModule {}
