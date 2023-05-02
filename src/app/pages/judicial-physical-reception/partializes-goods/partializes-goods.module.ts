import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ExcelReportComponent } from 'src/app/@standalone/excel-report/excel-report.component';

import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TreeViewComponent } from 'src/app/@standalone/tree-view/tree-view.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PartializedTreeViewComponent } from './partialized-tree-view/partialized-tree-view.component';
import { PartializesGoodsRoutingModule } from './partializes-goods-routing.module';
import { PartializesGoodsComponent } from './partializes-goods.component';

@NgModule({
  declarations: [PartializesGoodsComponent, PartializedTreeViewComponent],
  imports: [
    CommonModule,
    PartializesGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    TreeViewComponent,
    ExcelReportComponent,
  ],
})
export class PartializesGoodsModule {}
