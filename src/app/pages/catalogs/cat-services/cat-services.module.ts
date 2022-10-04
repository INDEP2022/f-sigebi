import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CatServicesRoutingModule } from './cat-services-routing.module';
import { CatServicesListComponent } from './cat-services-list/cat-services-list.component';
import { CatServicesFormComponent } from './cat-services-form/cat-services-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';

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
