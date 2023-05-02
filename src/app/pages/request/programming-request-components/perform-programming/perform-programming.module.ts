import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from 'src/app/shared/shared.module';
import { EstateSearchFormComponent } from './estate-search-form/estate-search-form.component';
import { PerformProgrammingFormComponent } from './perform-programming-form/perform-programming-form.component';
import { PerformProgrammingRoutingModule } from './perform-programming-routing.module';
import { UserFormComponent } from './user-form/user-form.component';
import { WarehouseSelectFormComponent } from './warehouse-select-form/warehouse-select-form.component';

@NgModule({
  declarations: [
    PerformProgrammingFormComponent,
    UserFormComponent,
    EstateSearchFormComponent,
    WarehouseSelectFormComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    NgScrollbarModule,
    TabsModule,
    PerformProgrammingRoutingModule,
    ModalModule.forChild(),
  ],
})
export class PerformProgrammingModule {}
