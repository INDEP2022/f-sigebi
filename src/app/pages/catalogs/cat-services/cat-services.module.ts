import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatServicesFormComponent } from './cat-services-form/cat-services-form.component';
import { CatServicesListComponent } from './cat-services-list/cat-services-list.component';
import { CatServicesRoutingModule } from './cat-services-routing.module';

@NgModule({
  declarations: [CatServicesListComponent, CatServicesFormComponent],
  imports: [
    CommonModule,
    SharedModule,
    ModalModule.forChild(),
    CatServicesRoutingModule,
  ],
})
export class CatServicesModule {}
