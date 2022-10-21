import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { JprComplementArticleRoutingModule } from './jpr-complement-article-routing.module';
import { JprComplementArticleComponent } from './jpr-complement-article.component';

@NgModule({
  declarations: [JprComplementArticleComponent],
  imports: [
    CommonModule,
    JprComplementArticleRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class JprComplementArticleModule {}
