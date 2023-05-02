import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { LegendFormComponent } from './legend-form/legend-form.component';
import { LegendsListComponent } from './legends-list/legends-list.component';
import { LegendsRoutingModule } from './legends-routing.module';

@NgModule({
  declarations: [LegendsListComponent, LegendFormComponent],
  imports: [
    CommonModule,
    LegendsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class LegendsModule {}
