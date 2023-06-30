import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
//Shared
import { SharedModule } from 'src/app/shared/shared.module';
//Reactive Forms
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//Ngx Bootstrap
import { TabsModule } from 'ngx-bootstrap/tabs';
//Routing
import { GoodsTrackingRoutingModule } from './goods-tracking-routing.module';
//Components
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormLoaderComponent } from 'src/app/@standalone/form-loader/form-loader.component';
import { AddmotiveComponent } from './addmotive/addmotive.component';
import { DobleclickaddComponent } from './dobleclickadd/dobleclickadd.component';
import { GoodsReviewStatusComponent } from './goods-review-status/goods-review-status.component';
import { ListNoAttendedComponent } from './list-no-attended/list-no-attended.component';
@NgModule({
  declarations: [
    GoodsReviewStatusComponent,
    ListNoAttendedComponent,
    AddmotiveComponent,
    DobleclickaddComponent,
  ],
  imports: [
    CommonModule,
    GoodsTrackingRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    FormLoaderComponent,
    TooltipModule.forRoot(),
  ],
})
export class GoodsTrackingModule {}
