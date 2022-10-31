import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { PHOTOGRAPHY_COLUMNS } from 'src/app/pages/request/programming-request-components/execute-reception/photography-form/photography-columns';

@Component({
  selector: 'app-photos-good',
  templateUrl: './photos-good.component.html',
  styles: [],
})
export class PhotosGoodComponent extends BasePage implements OnInit {
  @Input() photosGood: FormGroup;
  imagesData: any[] = [];

  constructor() {
    super();
    this.settings = {
      ...this.settings,
      columns: PHOTOGRAPHY_COLUMNS,
      edit: { editButtonContent: '<i class="fa fa fa-file"></i>' },
      delete: {
        deleteButtonContent: '<i class="fa fa-eye text-info mx-2"></i>',
      },
    };

    this.imagesData = [
      {
        noPhotography: 435345345,
        managementNumber: 564564566,
        titleDocument: 'Documeto prueba',
        typeDocument: 'Prueba',
        author: 'Gustavo',
        creationDate: '12-11-1999',
      },
    ];
  }

  ngOnInit(): void {}

  viewImage() {}
}
