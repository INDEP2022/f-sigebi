import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SatClasificationRoutingModule } from './sat-clasification-routing.module';
import { SatClasificationListComponent } from './sat-clasification-list/sat-clasification-list.component';
import { SatClasificationFormComponent } from './sat-clasification-form/sat-clasification-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [SatClasificationListComponent, SatClasificationFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    SatClasificationRoutingModule,
  ],
})
export class SatClasificationModule {}
