import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LegendsRoutingModule } from './legends-routing.module';
import { LegendsListComponent } from './legends-list/legends-list.component';
import { LegendFormComponent } from './legend-form/legend-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { LegendService } from 'src/app/core/services/catalogs/legend.service';

@NgModule({
  declarations: [LegendsListComponent, LegendFormComponent],
  imports: [
    CommonModule,
    LegendsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
  providers: [LegendService],
})
export class LegendsModule {}
