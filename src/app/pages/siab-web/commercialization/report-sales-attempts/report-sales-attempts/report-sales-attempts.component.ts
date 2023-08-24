import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BehaviorSubject, map, merge, takeUntil } from 'rxjs';
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
  propertyValues: string[] = [];
  commaSeparatedString: string = '';
  totalItems: number = 0;
  private isFirstLoad = true;

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

    const observable1 = this.params.pipe(map(() => this.consultarBienExcel()));
    const observable2 = this.params.pipe(map(() => this.consultarBien()));
    const observable3 = this.params.pipe(map(() => this.consultarOnlyOne()));

    const combinedObservable = merge(observable1, observable2, observable3);

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.isFirstLoad) {
        this.consultarBienExcel();
        this.consultarBien();
      }
    });
    this.isFirstLoad = false;
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
    if (!this.commaSeparatedString) {
      this.alert('warning', 'Debe importar el Archivo Excel', '');
      return;
    }

    let params = {
      ...this.params.getValue(),
    };
    let body = {
      pGoodNumber: this.commaSeparatedString,
      pType: 0,
      pSubtypes: '',
      pStatus: '',
      ...this.params.getValue(),
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

  consultarOnlyOne() {
    if (!this.form.get('onlyOne').value) {
      this.alert('warning', 'Es Necesario Contar con el No. Bien', '');
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
      return;
    }

    console.log(selectedTypeNumber);

    let params = {
      ...this.params.getValue(),
    };
    let body = {
      pType: resultArray[0].typeNumber,
      pSubtypes: resultArray[0].subTypeNumber,
      pStatus: resultStatus[0].status,
      ...this.params.getValue(),
    };
    console.log(params);
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
