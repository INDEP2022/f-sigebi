import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { WContentService } from 'src/app/core/services/ms-wcontent/wcontent.service';
import { TABLE_SETTINGS } from '../../../../../../../common/constants/table-settings';
import { ListParams } from '../../../../../../../common/repository/interfaces/list-params';
import { BasePage } from '../../../../../../../core/shared/base-page';
import { PHOTOS_TABLE_COLUMNS } from '../columns/photos-table-columns';

var data = [
  {
    id: 1,
    noPhoto: 'SEA12454',
    documentTitle: 'imagenes.jpg',
    author: 'chujillo_sea',
    creationDate: '11/12/2022',
    noManagement: 894045,
  },
];

@Component({
  selector: 'app-open-photos',
  templateUrl: './open-photos.component.html',
  styleUrls: ['./open-photos.component.scss'],
})
export class OpenPhotosComponent extends BasePage implements OnInit {
  paragraphs: any[] = [];
  information: any;
  columns = PHOTOS_TABLE_COLUMNS;
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;

  constructor(
    private bsModalRef: BsModalRef,
    private wContentService: WContentService
  ) {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      actions: false,
      selectMode: '',
      columns: PHOTOS_TABLE_COLUMNS,
    };
    this.columns.actions = {
      ...this.columns.actions,
      onComponentInitFunction: (instance?: any) => {
        instance.btnclick.subscribe((data: any) => {
          console.log(data);
        });
      },
    };
    this.paragraphs = data;
    console.log('dd', this.information);
  }

  /*getImagesGood() {
    this.wContentService
      .getImagesByGood(this.information.id)
      .subscribe(data => {
        console.log('data', data);
      });
  } */

  close(): void {
    this.bsModalRef.hide();
  }
}
