import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ComerGoodsXLotService } from 'src/app/core/services/ms-comersale/comer-goods-x-lot.service';
import { StatusGoodService } from 'src/app/core/services/ms-good/status-good.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { BasePage } from 'src/app/core/shared';
import { TO_JSON } from 'src/app/pages/admin/home/constants/excel-to-json-columns';
import { JSON_TO } from 'src/app/pages/admin/home/constants/json-to-csv';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

interface IExcelToJson {
  NO_BIEN: number;
}

@Component({
  selector: 'app-report-sales-attempts',
  templateUrl: './report-sales-attempts.component.html',
  styles: [],
})
export class ReportSalesAttemptsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data: IExcelToJson[] = [];
  tiposData = new DefaultSelect();
  tiposstatus = new DefaultSelect();
  dataExcel: any = [];
  Tbienes: any = [];
  result: any = [];
  status: any = [];
  source: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  fileReader = new FileReader();
  jsonToCsv = JSON_TO;
  until = false;

  get filterGoods() {
    return this.form.get('filterGoods');
  }

  get filterText() {
    return this.form.get('filterText');
  }

  constructor(
    private fb: FormBuilder,
    private excelService: ExcelService,
    private goodprocessService: GoodprocessService,
    private statusGoodService: StatusGoodService,
    private getparEportAttemptsVta: ComerGoodsXLotService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: TO_JSON,
    };
  }

  ngOnInit(): void {
    this.prepareForm2();
    this.getTodos(new ListParams());
    this.getStatus(new ListParams());
  }

  private prepareForm2() {
    this.form = this.fb.group({
      typeGood: [],
      typeStatus: [],
      filterGoods: [],
      filterText: [],
    });
    setTimeout(() => {
      this.getStatus(new ListParams());
    }, 1000);
  }

  chargeFile(event: any) {}

  onFileChange(event: Event) {
    try {
      const files = (event.target as HTMLInputElement).files;
      if (!files || files.length !== 1) {
        throw new Error('Please select one file.');
      }

      // Limpia cualquier evento onload anterior
      this.fileReader.onload = null;

      // Asigna el evento onload para manejar la lectura del archivo
      this.fileReader.onload = loadEvent => {
        if (loadEvent.target && loadEvent.target.result) {
          // Llama a la función para procesar el archivo
          this.readExcel(loadEvent.target.result);

          // Limpia el input de archivo para permitir cargar el mismo archivo nuevamente
          (event.target as HTMLInputElement).value = '';
        }
        console.log(this.fileReader.onload);
      };

      // Lee el contenido binario del archivo
      this.fileReader.readAsBinaryString(files[0]);
    } catch (error) {
      console.error('Error:', error);
      // Maneja el error de acuerdo a tus necesidades
    }
  }

  readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      this.dataExcel = this.excelService.getData<IExcelToJson>(binaryExcel);
      const mappedData: any = [];
      for (let i = 0; i < this.dataExcel.length; i++) {
        mappedData.push({
          id: this.dataExcel[i].pGoodNumber,
        });
      }
      this.source.load(mappedData);
      this.until = true;
      this.source.refresh();
      console.log(this.dataExcel);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  exportCsv() {
    const filename: string = 'Archivo Prueba';
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
  }

  getTodos(params: ListParams, id?: string) {
    // this.loading = true;
    const params_ = new FilterParams();

    params_.page = params.page;
    params_.limit = params.limit;

    let params__ = '';
    if (params?.text.length > 0)
      if (!isNaN(parseInt(params?.text))) {
        console.log('SI');
        params_.addFilter('clasifGoodNumber', params.text, SearchFilter.EQ);
        console.log(params.text);
      } else {
        console.log('NO');
        params_.search = params.text;
      }

    this.goodprocessService.getGoodType_(params_.getParams()).subscribe(
      (response: any) => {
        console.log('rrr', response);
        this.result = response.data.map(async (item: any) => {
          item['tipoSupbtipoDescription'] =
            item.clasifGoodNumber +
            ' - ' +
            item.typeDesc +
            ' - ' +
            item.subTypeDesc +
            ' - ' +
            item.ssubTypeDesc +
            ' - ' +
            item.sssubTypeDesc;
        });
        Promise.all(this.result).then((resp: any) => {
          this.tiposData = new DefaultSelect(response.data, response.count);
          console.log(this.result);
          console.log(this.tiposData);

          // this.loading = false;
        });
        //console.log(response);
      },
      error => {
        this.tiposData = new DefaultSelect([], 0);
        console.log('ERR', error);
      }
    );
  }

  getStatus(params: ListParams) {
    this.loading = true;
    // Obtener el valor del filtro del formulario
    const val = this.form.get('typeStatus').value;
    console.log(val);

    console.log(val);
    if (val === null) {
      if (params['search']) {
        params['filter.status'] = params['search'];
      } else {
        delete params['filter.status'];
      }
    } else {
      params['filter.status'] = val;
    }

    console.log(params['search']);

    this.statusGoodService.getAll(params).subscribe(
      (response: any) => {
        console.log('rrr', response);
        this.status = response.data.map(async (item: any) => {
          item['tipoSupbtipoDescription'] =
            item.status + ' - ' + item.description;
          return item; // Asegurarse de devolver el item modificado.
        });

        Promise.all(this.status).then((resp: any) => {
          this.tiposstatus = new DefaultSelect(response.data, response.count);
          console.log(this.status);
          console.log(this.tiposstatus);

          this.loading = false; // Colocar el loading en false después de mostrar los datos.
        });

        console.log(response);
      },
      error => {
        this.tiposData = new DefaultSelect([], 0);
        console.log('ERR', error);
      }
    );
  }

  getStatuss(params: ListParams, id?: string) {
    this.statusGoodService.getAll(params).subscribe((data: any) => {
      this.tiposstatus = new DefaultSelect(data.data, data.count);
    });
  }

  consultarBien() {
    console.log(this.form.get('typeGood').value);
    console.log(this.tiposData);
    const selectedTypeNumber = this.form.get('typeGood').value;
    const selectedTypeStatus = this.form.get('typeStatus').value;
    const resultArray = this.tiposData.data['filter'](
      (item: any) => item.clasifGoodNumber === selectedTypeNumber
    );
    const resultStatus = this.tiposstatus.data['filter'](
      (item: any) => item.status === selectedTypeStatus
    );
    console.log(selectedTypeStatus);

    console.log(selectedTypeNumber);
    if (this.dataExcel.length > 0) {
      this.dataExcel.map((item: any) => {
        item['pType'] = resultArray[0].typeNumber;
        item['pSubtypes'] = resultArray[0].subTypeNumber;
        item['pStatus'] = resultStatus[0].status;
      });

      let params = {
        ...this.params.getValue(),
      };
      console.log(params);
      this.getparEportAttemptsVta
        .getpaREportAttemptsVta(this.dataExcel, params)
        .subscribe({
          next: resp => {
            console.log(resp);
          },
          error: err => {
            console.log(err);
          },
        });
    } else {
      let params = {
        ...this.params.getValue(),
      };
      let body = {
        pType: resultArray[0].typeNumber,
        pSubtypes: resultArray[0].subTypeNumber,
        pStatus: resultStatus[0].status,
      };
      console.log(params);
      this.getparEportAttemptsVta
        .getpaREportAttemptsVta(body, params)
        .subscribe({
          next: resp => {
            console.log(resp);
          },
          error: err => {
            console.log(err);
          },
        });
    }
  }

  clean() {
    this.form.get('typeStatus').setValue(null);

    // Llamar a getEvent sin el filtro
    this.getStatus({});
  }
}
