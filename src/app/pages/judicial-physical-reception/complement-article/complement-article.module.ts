import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComplementArticleRoutingModule } from './complement-article-routing.module';
import { ComplementArticleComponent } from './complement-article.component';

@NgModule({
  declarations: [ComplementArticleComponent],
  imports: [
    CommonModule,
    ComplementArticleRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
  ],
})
export class ComplementArticleModule {}
