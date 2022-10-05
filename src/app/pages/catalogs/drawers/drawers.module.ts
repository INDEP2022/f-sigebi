import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { FractionsRoutingModule } from '../fractions/fractions-routing.module';
import { DrawersListComponent } from './drawers-list/drawers-list.component';
import { DrawersRoutingModule } from './drawers-routing.module';
import { DrawerFormComponent } from './drawer-form/drawer-form.component';

@NgModule({
  declarations: [DrawersListComponent, DrawerFormComponent],

  imports: [
    CommonModule,
    DrawersRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class DrawersModule {}
