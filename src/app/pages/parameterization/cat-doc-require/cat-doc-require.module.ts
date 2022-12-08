import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatDocRequireModalComponent } from './cat-doc-require-modal/cat-doc-require-modal.component';
import { CatDocRequireRoutingModule } from './cat-doc-require-routing.module';
import { CatDocRequireComponent } from './cat-doc-require/cat-doc-require.component';

@NgModule({
  declarations: [CatDocRequireComponent, CatDocRequireModalComponent],
  imports: [
    CommonModule,
    CatDocRequireRoutingModule,
    SharedModule,
    ModalModule.forChild(),
  ],
})
export class CatDocRequireModule {}
