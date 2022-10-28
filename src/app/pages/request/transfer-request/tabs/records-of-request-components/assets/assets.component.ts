import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { BasePage } from 'src/app/core/shared/base-page';
import { ASSETS_COLUMNS } from './assests-columns';

var data = [
  {
    id: 1,
    noManagement: '1546645',
    descripTransfeAsset: 'descripcion',
    typeAsset: 'VEHICULO',
    physicalState: 'BUENO',
    conservationState: 'BUENO',
    tansferUnitMeasure: '',
    transferAmount: '',
    destinyLigie: '',
    destinyTransfer: '',
    householdAsset: '',
  },
];
@Component({
  selector: 'app-assets',
  templateUrl: './assets.component.html',
  styles: [],
})
export class AssetsComponent extends BasePage implements OnInit {
  params = new BehaviorSubject<ListParams>(new ListParams());
  paragraphs: any[] = [];
  createNewAsset: boolean = false;
  //typeDoc: string = '';

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.settings = {
      ...TABLE_SETTINGS,
      columns: ASSETS_COLUMNS,
    };
    this.settings.actions.delete = true;
    this.settings.actions.position = 'left';

    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.getData());
  }
  getData(): void {
    this.loading = true;
    this.paragraphs = data;
    setTimeout(() => {
      this.loading = false;
    }, 2000);
  }

  onFileChange(event: any) {
    console.log(event);
  }

  editRequest(event?: any) {
    console.log(event);
  }

  newAsset(): void {
    this.createNewAsset = true;
  }

  openForm(event: any) {}

  showDeleteAlert(event: any): void {
    console.log(event);
  }
}
