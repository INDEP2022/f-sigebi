import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//NGX-Bootstrap
import { ModalModule } from 'ngx-bootstrap/modal';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Routing
import { BrandsSubBrandsRoutingModule } from './brands-sub-brands-routing.module';
//Components
import { BrandsSubBrandsFormComponent } from './brands-sub-brands-form/brands-sub-brands-form.component';
import { BrandsSubBrandsListComponent } from './brands-sub-brands-list/brands-sub-brands-list.component';
import { SubBrandsListComponent } from './brands-sub-brands-list/sub-brands-list/sub-brands-list.component';

@NgModule({
  declarations: [
    BrandsSubBrandsListComponent,
    BrandsSubBrandsFormComponent,
    SubBrandsListComponent,
  ],
  imports: [
    CommonModule,
    BrandsSubBrandsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class BrandsSubBrandsModule {}
