import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, takeUntil } from 'rxjs';
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
  styles: [
    `
      button.loading:after {
        content: '';
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: 2px solid #fff;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-left: 5px;
        vertical-align: middle;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class ReportSalesAttemptsComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  data: IExcelToJson[] = [];
  tiposData = new DefaultSelect();
  loadingBtn: boolean = false;
  loadingBtn2: boolean = false;
  loadingBtn3 = false;
  loadingBtn4 = false;
  tiposstatus = new DefaultSelect();
  dataExcel: any = [];
  Tbienes: any = [];
  result: any = [];
  status: any = [];
  source: LocalDataSource = new LocalDataSource();
  params = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  fileReader = new FileReader();
  jsonToCsv = JSON_TO;
  until = false;
  until2 = false;
  until3 = false;
  propertyValues: string[] = [];
  commaSeparatedString: string = '';
  totalItems: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  private isFirstLoad = true;
  private isSecondLoad = true;

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

    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.isFirstLoad) {
        this.consultarBien();
      }

      if (!this.isSecondLoad) {
        this.consultarBienExcel();
      }
    });
    this.isFirstLoad = false;

    this.params3.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.isSecondLoad) {
        this.consultarBienExcel();
      }
    });
    this.isSecondLoad = false;
  }

  private prepareForm2() {
    this.form = this.fb.group({
      onlyOne: [],
      typeGood: [],
      typeStatus: [],
      filterGoods: [],
      filterText: [],
      radio: [''],
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
      this.propertyValues = this.dataExcel.map((item: any) => item.no_bien);

      // Unir las cadenas con comas para obtener una cadena separada por comas
      this.commaSeparatedString = this.propertyValues.join(',');

      console.log(this.commaSeparatedString);
      console.log(this.dataExcel);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  consultarBienExcel() {
    this.loadingBtn4 = true;
    if (!this.commaSeparatedString) {
      this.alert('warning', 'Debe importar el Archivo Excel', '');
      this.loadingBtn4 = false;
      return;
    }

    let params = {
      ...this.params3.getValue(),
    };
    let body = {
      pGoodNumber: this.commaSeparatedString,
      pType: 0,
      pSubtypes: '',
      pStatus: '',
      ...this.params3.getValue(),
    };
    console.log(body);
    this.getparEportAttemptsVta.getpaREportAttemptsVta(body, params).subscribe({
      next: resp => {
        console.log(resp);
        // Contar la cantidad de veces que aparece "no_bien" en la respuesta
        // Crear un objeto para almacenar las ocurrencias de cada valor en no_bien
        const countMap: { [key: string]: number } = {}; // Anotación de tipo para countMap

        // Recorrer los registros y contar las ocurrencias
        resp.data.forEach((item: any) => {
          const noBienValue: string = item.no_bien;
          if (countMap[noBienValue]) {
            countMap[noBienValue]++;
          } else {
            countMap[noBienValue] = 1;
          }
        });
        this.loadingBtn4 = false;
        console.log('Conteo de ocurrencias de cada bien:', countMap);
        const newData = Object.keys(countMap).map(bien => ({
          bien,
          conteo_ocurrencias: countMap[bien],
        }));

        // Crear una instancia de LocalDataSource con la nueva estructura de datos
        // this.source = new LocalDataSource(newData);

        // // Opcionalmente, configurar las columnas de la tabla
        // this.settings.columns = {
        //   bien: { title: 'No. Bien', sort: false },
        //   conteo_ocurrencias: { title: 'Intentos de Venta', sort: false },
        //   // ... otras columnas ...
        // };
        this.source.load(resp.data);
        this.until3 = true;
        this.source.refresh();
        this.totalItems3 = resp.count;
      },
      error: err => {
        console.log(err);
        this.alert('error', 'No se Encontraron Registros', '');
      },
    });
  }

  consultarOnlyOne() {
    this.loadingBtn = true;
    if (!this.form.get('onlyOne').value) {
      this.alert('warning', 'Es Necesario Contar con el No. Bien', '');
      this.loadingBtn = false;
      return;
    }
    let params = {};
    let body = {
      pGoodNumber: this.form.get('onlyOne').value,
      pType: 0,
      pSubtypes: '',
      pStatus: '',
      ...this.params.getValue(),
    };
    console.log(body);
    this.getparEportAttemptsVta
      .getpaREportAttemptsVta(body, this.params.getValue())
      .subscribe({
        next: resp => {
          console.log(resp);
          // Contar la cantidad de veces que aparece "no_bien" en la respuesta
          // Crear un objeto para almacenar las ocurrencias de cada valor en no_bien
          const countMap: { [key: string]: number } = {}; // Anotación de tipo para countMap

          // Recorrer los registros y contar las ocurrencias
          resp.data.forEach((item: any) => {
            const noBienValue: string = item.no_bien;
            if (countMap[noBienValue]) {
              countMap[noBienValue]++;
            } else {
              countMap[noBienValue] = 1;
            }
          });

          console.log('Conteo de ocurrencias de cada bien:', countMap);
          this.loadingBtn = false;
          const newData = Object.keys(countMap).map(bien => ({
            bien,
            conteo_ocurrencias: countMap[bien],
          }));

          // Crear una instancia de LocalDataSource con la nueva estructura de datos
          // this.source = new LocalDataSource(newData);

          // // Opcionalmente, configurar las columnas de la tabla
          // this.settings.columns = {
          //   bien: { title: 'No. Bien', sort: false },
          //   conteo_ocurrencias: { title: 'Intentos de Venta', sort: false },
          //   // ... otras columnas ...
          // };
          this.source.load(resp.data);
          this.until = true;
          this.source.refresh();
          this.totalItems = resp.count;
        },
        error: err => {
          console.log(err);
          this.alert('error', 'No se Encontraron Registros', '');
        },
      });
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
    this.isFirstLoad = true;
    this.loadingBtn3 = true;
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

    if (!selectedTypeStatus) {
      this.alert('warning', 'Debe Seleccionar los Filtros', '');
      this.loadingBtn3 = false;
      return;
    }

    console.log(selectedTypeNumber);

    let params = {
      ...this.params2.getValue(),
    };
    let body = {
      pType: resultArray[0].typeNumber,
      pSubtypes: resultArray[0].subTypeNumber,
      pStatus: resultStatus[0].status,
      ...this.params2.getValue(),
    };
    console.log(params);
    this.getparEportAttemptsVta.getpaREportAttemptsVta(body, params).subscribe({
      next: resp => {
        console.log(resp);

        if (this.totalItems2 === 0) {
          this.alert('error', 'No se encontraron registros', '');
          this.loadingBtn3 = false;
          return;
        }
        // Contar la cantidad de veces que aparece "no_bien" en la respuesta
        // Crear un objeto para almacenar las ocurrencias de cada valor en no_bien
        const countMap: { [key: string]: number } = {}; // Anotación de tipo para countMap
        this.loadingBtn3 = false;
        // Recorrer los registros y contar las ocurrencias
        resp.data.forEach((item: any) => {
          const noBienValue: string = item.no_bien;
          if (countMap[noBienValue]) {
            countMap[noBienValue]++;
          } else {
            countMap[noBienValue] = 1;
          }
        });

        console.log('Conteo de ocurrencias de cada bien:', countMap);
        const newData = Object.keys(countMap).map(bien => ({
          bien,
          conteo_ocurrencias: countMap[bien],
        }));

        // Crear una instancia de LocalDataSource con la nueva estructura de datos
        // this.source = new LocalDataSource(newData);

        // // Opcionalmente, configurar las columnas de la tabla
        // this.settings.columns = {
        //   bien: { title: 'No. Bien', sort: false },
        //   conteo_ocurrencias: { title: 'Intentos de Venta', sort: false },
        //   // ... otras columnas ...
        // };

        this.source.load(resp.data);
        this.until2 = true;
        this.source.refresh();
        this.totalItems2 = resp.count;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  cleanFilter() {
    this.form.get('typeStatus').setValue(null);
    this.form.get('typeGood').setValue(null);

    // Llamar a getEvent sin el filtro
    this.getStatus({});
    this.source.load([]);
    this.until = false;
  }

  cleanOnly() {
    this.form.get('onlyOne').setValue(null);

    // Llamar a getEvent sin el filtro
    this.source.load([]);
    this.until = false;
  }

  cleanExcel() {
    this.dataExcel = [];

    // Llamar a getEvent sin el filtro
    this.source.load([]);
    this.until = false;
  }
}
