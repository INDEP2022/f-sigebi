import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
//Routing
import { GoodsTypeCrimeRoutingModule } from './goods-type-crime-routing.module';
//@Standalone Components
import { AreasSharedComponent } from 'src/app/@standalone/shared-forms/areas-shared/areas-shared.component';
import { CrimesSharedComponent } from 'src/app/@standalone/shared-forms/crimes-shared/crimes-shared.component';
import { DelegationSharedComponent } from 'src/app/@standalone/shared-forms/delegation-shared/delegation-shared.component';
import { GoodsTypesSharedComponent } from 'src/app/@standalone/shared-forms/goods-types-shared/goods-types-shared.component';
//Components
import { GoodsTypeCrimeReportsComponent } from './goods-type-crime-reports/goods-type-crime-reports.component';

@NgModule({
  declarations: [GoodsTypeCrimeReportsComponent],
  imports: [
    CommonModule,
    GoodsTypeCrimeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    BsDatepickerModule,
    DelegationSharedComponent,
    CrimesSharedComponent,
    AreasSharedComponent,
    GoodsTypesSharedComponent,
  ],
})
export class GoodsTypeCrimeModule {}
