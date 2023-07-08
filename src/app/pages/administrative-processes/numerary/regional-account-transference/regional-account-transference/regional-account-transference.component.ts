import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { SurvillanceService } from 'src/app/core/services/ms-survillance/survillance.service';
import { TranfergoodService } from 'src/app/core/services/ms-transfergood/transfergood.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  KEYGENERATION_PATTERN,
  STRING_PATTERN,
} from 'src/app/core/shared/patterns';
import { ExcelService } from '../../../../../common/services/excel.service';
import { REGIONAL_ACCOUNT_COLUMNS } from './regional-account-columns';

interface IExcelToJson {
  expediente: number;
  bien: number;
}
@Component({
  selector: 'app-regional-account-transference',
  templateUrl: './regional-account-transference.component.html',
  styles: [],
})
export class RegionalAccountTransferenceComponent
  extends BasePage
  implements OnInit
{
  form: FormGroup;
  total = '22,891.26';
  data1: any[] = [];
  dataTable = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  data: IExcelToJson[] = [];
  constructor(
    private fb: FormBuilder,
    private survillanceService: SurvillanceService,
    private ExcelService: ExcelService,
    private tranfergoodService: TranfergoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: REGIONAL_ACCOUNT_COLUMNS,
    };
  }

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null, Validators.required],
      idRequest: [null, Validators.required],

      transferenceReport: [null, Validators.required],
      dateReport: [null, Validators.required],

      historicCheck: [null, Validators.required],

      currencyType: [null, Validators.required],
      delegation: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      folioCash: [null, Validators.required],
      transactionDate: [null, Validators.required],

      cveAccount: [null, Validators.required],
      accountType: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      cveBank: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
      cveCurrency: [
        null,
        [Validators.required, Validators.pattern(KEYGENERATION_PATTERN)],
      ],
    });
  }

  getTransNumerario() {
    this.data1 = [];
    //this.dataTable.load([]);
    console.log(
      "this.form.get('idRequest').value ",
      this.form.get('idRequest').value
    );
    this.survillanceService
      .getTransNumerarioReg(this.form.get('idRequest').value)
      .subscribe({
        next: resp => {
          console.log('resp ', resp);
          for (let i = 0; resp.data.length; i++) {
            console.log('data JCH: ', resp.data[i]);
            if (resp.data[i] != undefined) {
              let item = {
                file: resp.data[i].no_expediente,
                good: resp.data[i].no_bien,
                description: resp.data[i].descripcion,
                status: resp.data[i].estatus,
                interests: resp.data[i].tot_interes,
                total: resp.data[i].tot_numerario,
              };
              this.data1.push(item);
              this.dataTable.load(this.data1);
            } else {
              this.dataTable.refresh();
              break;
            }
          }
        },
        error: err => {
          let error = '';
          if (err.status === 0) {
            error = 'Revise su conexión de Internet.';
          } else {
            error = err.error.message;
          }
          this.onLoadToast('error', error, '');
        },
      });
  }

  onFileChange(event: Event) {
    console.log('Datos Ecxel');
    const file = (event.target as HTMLInputElement).files[0];
    let formData = new FormData();
    formData.append('file', file);
    this.getDataFile(formData);
  }

  getDataFile(formData: FormData) {
    this.data1 = [];
    this.tranfergoodService.getFileCSV(formData).subscribe({
      next: resp => {
        console.log('resp excel ', resp); //resp excel
        for (let i = 0; resp.data.length; i++) {
          console.log('data JCH: ', resp.data[i]);
          if (resp.data[i] != undefined) {
            let item = {
              file: resp.data[i].NO_EXPEDIENTE,
              good: resp.data[i].NO_BIEN,
              description: resp.data[i].DESCRIPCION,
              status: resp.data[i].ESTATUS,
            };
            this.data1.push(item);
            this.dataTable.load(this.data1);
          } else {
            this.dataTable.refresh();
            break;
          }
        }
      },
      error: err => {
        let error = '';
        if (err.status === 0) {
          error = 'Revise su conexión de Internet.';
        } else {
          error = err.error.message;
        }
        this.onLoadToast('error', error, '');
      },
    });
  }
}
