import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { GoodsClasificationSharedComponent } from 'src/app/@standalone/shared-forms/goods-classification-shared/goods-classification-shared.component';
import { GoodsStatusSharedComponent } from 'src/app/@standalone/shared-forms/goods-status-shared/goods-status-shared.component';
import { SelectFormComponent } from 'src/app/@standalone/shared-forms/select-form/select-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ApplyButtonComponent } from './components/apply-button/apply-button.component';
import { GoodFormComponent } from './components/good-form/good-form.component';
import { PartializeButtonComponent } from './components/partialize-button/partialize-button.component';
import { PartializeViewComponent } from './components/partialize-view/partialize-view.component';
import { PartializesGeneralGoodsRoutingModule } from './partializes-general-goods-routing.module';
import { PartializeGeneralGoodTab2Service } from './services/partialize-general-good-tab2.service';
import { PartializeGeneralGoodV2Tab2Service } from './services/partialize-general-good-v2-tab2.service';
import { PartializeGeneralGoodV2Service } from './services/partialize-general-good-v2.service';
import { PartializeGeneralGoodService } from './services/partialize-general-good.service';
import { PartializesGeneralGoodsComponent } from './views/partializes-general-goods.component';

@NgModule({
  declarations: [
    PartializesGeneralGoodsComponent,
    GoodFormComponent,
    PartializeButtonComponent,
    ApplyButtonComponent,
    PartializeViewComponent,
  ],
  imports: [
    CommonModule,
    PartializesGeneralGoodsRoutingModule,
    SharedModule,
    ModalModule.forChild(),
    TabsModule,
    GoodsStatusSharedComponent,
    GoodsClasificationSharedComponent,
    SelectFormComponent,
    FormLoaderComponent,
    AccordionModule,
  ],
  providers: [
    { provide: 'dbPartialize', useValue: 'goodsPartializeds1' },
    { provide: 'dbSelectedGood', useValue: 'goodSelected1' },
    PartializeGeneralGoodService,
    { provide: 'dbPartialize', useValue: 'goodsPartializeds2' },
    { provide: 'dbSelectedGood', useValue: 'goodSelected2' },
    PartializeGeneralGoodTab2Service,
    { provide: 'dbPartialize', useValue: 'goodsPartializeds1v1' },
    { provide: 'dbSelectedGood', useValue: 'goodSelected1v1' },
    PartializeGeneralGoodV2Service,
    { provide: 'dbPartialize', useValue: 'goodsPartializeds1v2' },
    { provide: 'dbSelectedGood', useValue: 'goodSelected1v2' },
    PartializeGeneralGoodV2Tab2Service,
  ],
})
export class PartializesGeneralGoodsModule {}
