import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JprComplementArticleRoutingModule } from './jpr-complement-article-routing.module';
import { JprComplementArticleComponent } from './jpr-complement-article.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';


@NgModule({
  declarations: [
    JprComplementArticleComponent
  ],
  imports: [
    CommonModule,
    JprComplementArticleRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ]
})
export class JprComplementArticleModule { }
