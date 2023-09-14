import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { SettingTableDefault } from 'src/app/@standalone/has-more-results/has-more-results.component';

@Component({
  selector: 'app-goods-generate-dialog',
  templateUrl: './goods-generate-dialog.component.html',
  styles: [],
})
export class GoodsGenerateDialogComponent implements OnInit {
  @Input() title = 'Bienes';
  @Input() columns: any;
  @Input() settingTable = {};
  dataFather: { goodNumberF: string; goodStatusF: string }[] = [];
  dataGenerate: { goodNumberS: string; goodStatusS: string }[] = [];
  settingsFather = { ...SettingTableDefault };
  settingsGenerate = { ...SettingTableDefault };
  constructor(private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.settingsFather.columns = {
      goodNumberF: {
        title: 'No. Bien',
        sort: false,
      },
      goodStatusF: {
        title: 'Estatus',
        sort: false,
      },
    };
    this.settingsGenerate.columns = {
      goodNumberS: {
        title: 'No. Bien',
        sort: false,
      },
      goodStatusS: {
        title: 'Estatus',
        sort: false,
      },
    };
    // this.params.pipe(skip(1)).subscribe((params: ListParams) => {
    //   this.getData(params);
    // });
  }

  isLoading = false;

  onClickSelect(event: any) {
    console.log('EVENT', event);
    this.close(event.data);
  }

  close(data?: any) {
    this.modalRef.hide();
  }
}
