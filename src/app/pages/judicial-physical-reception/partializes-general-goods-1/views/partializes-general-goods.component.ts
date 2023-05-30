import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { PartializeGeneralGoodV2Service } from '../services/partialize-general-good-v2.service';
import { PartializeGeneralGoodService } from '../services/partialize-general-good.service';

@Component({
  selector: 'app-partializes-general-goods',
  templateUrl: './partializes-general-goods.component.html',
  styleUrls: ['partializes-general-goods.component.scss'],
})
export class PartializesGeneralGoodsComponent {
  // version: number;
  // clasificators = 'Clasificadores (1424, 1426, 1427, 1575, 1590)';
  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private service: PartializeGeneralGoodService // private serviceTab2: PartializeGeneralGoodTab2Service, // private service2: PartializeGeneralGoodV2Service
  ) {}

  // get service() {
  //   return this.version === 1 ? this.service1 : this.service2;
  // }

  get pageLoading() {
    return this.service.pageLoading;
  }

  back() {
    this.location.back();
  }

  ngOnInit() {
    // this.route.url.subscribe(([url]) => {
    //   const { path, parameters } = url;
    //   if (path !== 'v1') {
    //     this.version = 2;
    //     this.clasificators = 'Clasificadores (62, 1424, 1426)';
    //   } else {
    //     this.version = 1;
    //     this.clasificators = 'Clasificadores (1424, 1426, 1427, 1575, 1590)';
    //   }
    //   console.log(path); // e.g. /products
    //   // console.log(parameters); // e.g. { id: 'x8klP0' }
    // });
  }
}
