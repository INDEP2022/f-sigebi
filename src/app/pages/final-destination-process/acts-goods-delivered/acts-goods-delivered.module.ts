import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { CustomSelectComponent } from 'src/app/@standalone/shared-forms/custom-select/custom-select.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ActsGoodsDeliveredRoutingModule } from './acts-goods-delivered-routing.module';
import { ActsGoodsDeliveredComponent } from './acts-goods-delivered/acts-goods-delivered.component';
import { SearchActsComponent } from './acts-goods-delivered/search-acts/search-acts.component';
@NgModule({
  declarations: [ActsGoodsDeliveredComponent, SearchActsComponent],
  imports: [
    CommonModule,
    ActsGoodsDeliveredRoutingModule,
    SharedModule,
    FormsModule,
    CustomSelectComponent,
    FormLoaderComponent,
    AccordionModule,
    TooltipModule,
  ],
})
export class ActsGoodsDeliveredModule {}
