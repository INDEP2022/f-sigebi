import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { CCBsbMBrandsSubBrandsRoutingModule } from './c-c-bsb-m-brands-sub-brands-routing.module';
//Components
import { CCBsbfCBrandsSubBrandsFormComponent } from './brands-sub-brands-form/c-c-bsbf-c-brands-sub-brands-form.component';
import { CCBsblCBrandsSubBrandsListComponent } from './brands-sub-brands-list/c-c-bsbl-c-brands-sub-brands-list.component';

@NgModule({
  declarations: [
    CCBsblCBrandsSubBrandsListComponent,
    CCBsbfCBrandsSubBrandsFormComponent,
  ],
  imports: [
    CommonModule,
    CCBsbMBrandsSubBrandsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class CCBsbMBrandsSubBrandsModule {}
