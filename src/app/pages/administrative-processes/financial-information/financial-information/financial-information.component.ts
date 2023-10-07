import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import { TABLE_SETTINGS } from 'src/app/common/constants/table-settings';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IFinancialInformationT } from 'src/app/core/models/catalogs/financial-information-model';
import { IGood } from 'src/app/core/models/good/good.model';
import { GoodService } from 'src/app/core/services/good/good.service';
import { FinantialInformationService } from 'src/app/core/services/ms-parameter-finantial/finantial-information.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  FINANCIAL_INFORMATION_COLUMNS1,
  FINANCIAL_INFORMATION_COLUMNS2,
} from './financial-information-columns';

@Component({
  selector: 'app-financial-information',
  templateUrl: './financial-information.component.html',
  styles: [],
})
export class FinancialInformationComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  goodList: IGood[] = [];
  good: IGood;
  id: number = 0;
  finantialList: IFinancialInformationT[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems1: number = 0;
  settings1: any;
  settings2: any;
  data2: any[] = [];
  datalocal: LocalDataSource = new LocalDataSource();
  ids: string;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  date: string;
  proficientOpinion: string;
  valuerOpinion: string;
  observations: string;
  quantity: number;
  description: string;
  goodId: number;
  selectedRows: any;

  validando: 'N';

  dataTable = [
    {
      idGoodNumber: '1',
      description: 'Descripción del Producto 1',
      value: 19.99,
    },
    {
      idGoodNumber: '2',
      description: 'Descripción del Producto 2',
      value: 29.99,
    },
    {
      idGoodNumber: '3',
      description: 'Descripción del Producto 3',
      value: 39.99,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private goodService: GoodService,
    private finantialInformationService: FinantialInformationService
  ) {
    super();
    this.settings1 = {
      ...TABLE_SETTINGS,
      actions: false,
      columns: { ...FINANCIAL_INFORMATION_COLUMNS1 },
    };

    this.settings2 = {
      editable: true,
      ...TABLE_SETTINGS,
      actions: false,
      columns: { ...FINANCIAL_INFORMATION_COLUMNS2 },
    };
  }

  ngOnInit(): void {
    this.prepareForm();
    for (let i = 0; i < this.dataTable.length; i++) {
      this.data2.push(this.dataTable[i]);
      this.datalocal.load(this.data2);
      this.datalocal.refresh();
    }
  }

  prepareForm() {
    this.form = this.fb.group({
      noBien: [null],
      date: [null],
      dictaminatedBy: [null],
      avaluo: [null],
      observations: [null],
      goodDescription: [null],
    });
  }
  onChangeGood() {
    this.searchGoods(this.form.value.noBien);
  }
  searchGoods(idGood: number | string) {
    this.goodService.getByIdNew(idGood, idGood).subscribe({
      next: response => {
        this.good = response;
        this.proficientOpinion = response.proficientOpinion;
        this.valuerOpinion = response.valuerOpinion;
        this.observations = response.observations;
        this.quantity = response.quantity;
        this.description = response.description;
        console.log(this.description);
        this.form.controls['dictaminatedBy'].setValue(this.proficientOpinion);
        this.form.controls['avaluo'].setValue(this.valuerOpinion);
        this.form.controls['observations'].setValue(this.observations);
        this.form.controls['goodDescription'].setValue(this.description);
        this.goodList.push(this.good);
        this.goodList.map(function (data) {
          return { value: data, title: data };
        });
        console.log('data-> ', this.goodList);
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', 'Bien no existe');
        this.form.reset();
        console.log(err);
      },
    });
  }

  loadFinancial(idGood: number | string) {
    this.finantialInformationService.findGood(idGood).subscribe({
      next: response => {
        console.log('loadFinancialTbl1-> ', response);
        this.finantialList = response.data;
        this.finantialList.forEach(date => {
          this.date = this.datePipe.transform(date.idInfoDate, 'dd/MM/yyyy');
        });
        this.searchGoods(idGood);
        this.form.controls['date'].setValue(this.date);
        //console.log('send 1 -> ', response.data[0].idAttributeNumber);

        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].idAttributeNumber != null) {
            this.finantialInformationService
              .getAttributesInfoFinancial(response.data[i].idAttributeNumber)
              .subscribe(resp => {
                console.log('getAttributesInfoFinancial resp ', resp);
              });
          }
        }

        // this.finantialList = response.data;
        // // console.log(this.finantialList);
        // this.finantialList.forEach(date => {
        //   this.date = this.datePipe.transform(date.idInfoDate, 'dd/MM/yyyy');
        // });
        // this.searchGoods(idGood);
        // this.form.controls['date'].setValue(this.date);
        // this.totalItems2 = response.count;
      },
      error: err => {
        this.onLoadToast(
          'info',
          'Opss..',
          'Este bien no tiene Información Financiera asociada'
        );
        console.log(err);
      },
    });
  }

  onUserRowSelect(event: any) {
    this.selectedRows = event.selected;
  }

  confirm() {}

  cleanForm() {
    this.form.reset();
    this.ids = '';
    this.finantialList = [];
  }

  addSelect() {
    let NO_ATRIBUTO: number;
    if (NO_ATRIBUTO == 123) {
      this.alertQuestion(
        'question',
        'Información Financiera',
        'El atributo de PERIODO es importante para los cálculos, es bajo su responsabilidad el mal funcionamiento de los resultados. ¿Desea borrar el atributo?'
      ).then(question => {
        if (question.isConfirmed) {
          /**DELETE_RECORD;
            vn_reg := to_number(:system.trigger_record);
            LIP_COMMIT_SILENCIOSO;
            :VALIDANDO := 'S';
            GO_BLOCK('ATRIBUTOS_INF_FINANCIERA');
            EXECUTE_QUERY(NO_VALIDATE);
            GO_BLOCK('INFORMACION_FINANCIERA');
            EXECUTE_QUERY(NO_VALIDATE);
            go_record(vn_reg);
            :VALIDANDO := 'N'; */
        }
      });
    }
  }

  removeSelect() {}
}
