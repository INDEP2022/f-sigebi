import { Component, Input, OnInit } from '@angular/core';
import { IMenuItem } from 'src/app/core/interfaces/menu.interface';

@Component({
  selector: 'app-menu-dynamic',
  templateUrl: './menu-dynamic.component.html',
  styles: [],
})
export class MenuDynamicComponent implements OnInit {
  @Input() hasChild: boolean;
  @Input() menuChild: IMenuItem[];
  constructor() {}

  ngOnInit(): void {}

  hasItems(item: IMenuItem) {
    return item.subItems !== undefined ? item.subItems.length > 0 : false;
  }

  updateStorage(item: IMenuItem) {
    if (item.label === 'Características del Bien') {
      localStorage.removeItem('selectedBad');
      localStorage.removeItem('goodCharacteristicNumber');
    }
    if (item.link === '/pages/general-processes/good-photos') {
      localStorage.removeItem('selectedGoodsForPhotos');
    }
  }
}
