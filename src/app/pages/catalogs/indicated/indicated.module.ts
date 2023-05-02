import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { IndicatedFormComponent } from './indicated-form/indicated-form.component';
import { IndicatedListComponent } from './indicated-list/indicated-list.component';
import { IndicatedRoutingModule } from './indicated-routing.module';

@NgModule({
  declarations: [IndicatedListComponent, IndicatedFormComponent],

  imports: [
    CommonModule,
    SharedModule,
    IndicatedRoutingModule,
    ModalModule.forChild(),
  ],
})
export class IndicatedModule {}
