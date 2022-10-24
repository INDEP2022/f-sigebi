import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { WarehouseConfirmComponent } from './warehouse-confirm/warehouse-confirm.component';
import { WarehouseFormComponent } from './warehouse-form/warehouse-form.component';
import { WarehouseRoutingModule } from './warehouse-routing.module';
import { WarehouseShowComponent } from './warehouse-show/warehouse-show.component';

@NgModule({
  declarations: [
    WarehouseFormComponent,
    WarehouseShowComponent,
    WarehouseConfirmComponent,
  ],

  imports: [
    CommonModule,
    SharedModule,
    WarehouseRoutingModule,
    ModalModule.forRoot(),
  ],
})
export class WarehouseModuele {}
