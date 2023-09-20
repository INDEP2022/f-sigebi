import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { ComerEventosService } from 'src/app/core/services/ms-event/comer-eventos.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { JSON_TO_MAYUS } from 'src/app/pages/admin/home/constants/json-to-csv';
import {
  BIEN_LOTES_COLUMNS,
  GRV_DETALLES_COLUMNS,
  GV_LOTES_COLUMNS,
} from './columns';

interface IExcelToJson {
  NO_BIEN: number;
}

@Component({
  selector: 'app-batch-status-monitoring',
  templateUrl: './batch-status-monitoring.component.html',
  styles: [],
})
export class BatchStatusMonitoringComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});
  form2: FormGroup = new FormGroup({});
  @ViewChild('modal', { static: false }) modal?: ModalDirective;
  fileReader = new FileReader();
  dataFormat: any[] = [];
  jsonToCsv = JSON_TO_MAYUS;
  params = new BehaviorSubject<ListParams>(new ListParams());
  params1 = new BehaviorSubject<ListParams>(new ListParams());
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  params3 = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  data1: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  data3: LocalDataSource = new LocalDataSource();
  commaSeparatedString: string = '';
  propertyValues: string[] = [];
  dataExcel: any = [];
  show: boolean = false;
  show2: boolean = false;
  show3: boolean = false;
  loading1 = false;
  loading2 = false;
  loading3 = false;
  loading4 = false;
  totInvoices: number = 0;
  totalItems: number = 0;
  totalItems1: number = 0;
  totalItems2: number = 0;
  totalItems3: number = 0;
  dataFormatPercentage: any[] = [];
  array: any;
  private isFirstLoad = true;
  arrayData: any;
  settings2 = {
    ...this.settings,
    actions: {
      columnTitle: 'Visualizar',
      position: 'right',
      delete: false,
    },
  };
  settings3 = {
    ...this.settings,
    actions: false,
  };
  constructor(
    private fb: FormBuilder,
    private comerEventosService: ComerEventosService,
    private excelService: ExcelService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      columns: { ...GRV_DETALLES_COLUMNS },
      rowClassFunction: (row: any) => {
        console.log(row.data);
        switch (row.data.id) {
          case '1':
            return 'bg-info0 text-white';
          //break;
          case '2':
            return 'bg-info2 text-white';
          //break;
          case '3':
            return 'bg-info4 text-white';
          //break;
          case '4':
            return 'bg-info6 text-white';
          //break;
          case '5':
            return 'bg-info8 text-white';
          //break;
          case '6':
            return 'bg-info10 text-white';
          //break;
          //break;
          /*case '12':
            return 'bg-info12 text-white'*/
          //break;
          default:
            return 'bg-light text-black';
        }
      },
    };
    this.settings2 = {
      ...this.settings2,
      edit: {
        editButtonContent: '<i class="fa fa-eye text-black mx-2"></i>',
      },
      columns: { ...GV_LOTES_COLUMNS },
    };

    this.settings3.columns = BIEN_LOTES_COLUMNS;
  }

  ngOnInit(): void {
    this.prepareForm();
    this.prepareForm2();

    this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.isFirstLoad) {
        this.source();
      }
    });
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      if (!this.isFirstLoad) {
        this.searchGoodExcel();
      }
    });
    this.isFirstLoad = false;
  }

  private prepareForm() {
    this.form = this.fb.group({
      typeGood: [null, [Validators.required]],
      event: [null, [Validators.required]],
      DescEvent: [null, [Validators.required]],
      transferee: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      allotment: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  private prepareForm2() {
    this.form2 = this.fb.group({
      radio: [null, [Validators.required]],
      onlyOne: [null, [Validators.required]],
    });
  }

  exportChangeLot() {
    const filename: string = 'Cambios de Estatus';

    if (!this.form.get('typeGood').value) {
      this.alert('warning', 'Debe seleccionar un Tipo de Bien', '');
      return;
    }

    if (!this.form.get('event').value) {
      this.alert('warning', 'Es necesario ingresar un Evento', '');
      return;
    }
    if (!this.form.get('transferee').value) {
      this.alert(
        'warning',
        'Es necesario ingresar una No. de Transferente',
        ''
      );
      return;
    }
    if (!this.form.get('allotment').value) {
      this.alert('warning', 'Es necesario ingresar el No. de Lote', '');
      return;
    }

    if (!this.form.get('DescEvent').value) {
      this.alert(
        'warning',
        'Es necesario ingresar la Descripción del Evento',
        ''
      );
      return;
    }

    let body = {
      pOption: 8, //Cambio de status - 3, historial
      pTypeGood: this.form.get('typeGood').value,
      pEventKey: this.form.get('event').value,
      pLot: this.form.get('allotment').value,
      pTrans: this.form.get('transferee').value,
      pEvent: this.form.get('DescEvent').value,
    };

    let params = {
      ...this.params.getValue(),
    };

    this.comerEventosService.getLoteExport(body, params).subscribe({
      next: resp => {
        const allData = resp.data;
        console.log(allData);
        // Combinar todos los registros en this.line
        this.excelService.export(allData, { filename });
      },
      error: err => {
        console.log(err);
        this.alert('warning', 'No hay datos disponibles para exportar', '');
      },
    });
  }

  source() {
    this.loading1 = true;
    if (!this.form.get('typeGood').value) {
      this.alert('warning', 'Debe seleccionar un Tipo de Bien', '');
      return;
    }

    if (!this.form.get('event').value) {
      this.alert('warning', 'Es necesario ingresar un Evento', '');
      return;
    }
    if (!this.form.get('transferee').value) {
      this.alert(
        'warning',
        'Es necesario ingresar una No. de Transferente',
        ''
      );
      return;
    }
    if (!this.form.get('allotment').value) {
      this.alert('warning', 'Es necesario ingresar el No. de Lote', '');
      return;
    }

    if (!this.form.get('DescEvent').value) {
      this.alert(
        'warning',
        'Es necesario ingresar la Descripción del Evento',
        ''
      );
      return;
    }

    let body = {
      pOption: 2, //Cambio de status - 3, historial
      pTypeGood: this.form.get('typeGood').value,
      pEventKey: this.form.get('event').value,
      pLot: this.form.get('allotment').value,
      pTrans: this.form.get('transferee').value,
      pEvent: this.form.get('DescEvent').value,
    };

    let params = {
      ...this.params.getValue(),
    };

    this.comerEventosService.getLoteExport(body, params).subscribe({
      next: resp => {
        this.data.load(resp.data);
        this.totalItems = resp.count;
        this.loading1 = false;
        this.consult();
        this.show2 = true;
      },
      error: err => {
        console.log(err);
        this.loading1 = false;
      },
    });
  }

  async sourceData() {
    return new Promise((resolve, reject) => {
      if (!this.form.get('typeGood').value) {
        this.alert('warning', 'Debe seleccionar un Tipo de Bien', '');
        return;
      }

      if (!this.form.get('event').value) {
        this.alert('warning', 'Es necesario ingresar un Evento', '');
        return;
      }
      if (!this.form.get('transferee').value) {
        this.alert(
          'warning',
          'Es necesario ingresar una No. de Transferente',
          ''
        );
        return;
      }
      if (!this.form.get('allotment').value) {
        this.alert('warning', 'Es necesario ingresar el No. de Lote', '');
        return;
      }

      if (!this.form.get('DescEvent').value) {
        this.alert(
          'warning',
          'Es necesario ingresar la Descripción del Evento',
          ''
        );
        return;
      }

      let body = {
        pOption: 1, //Cambio de status - 3, historial
        pTypeGood: this.form.get('typeGood').value,
        pEventKey: this.form.get('event').value,
        pLot: this.form.get('allotment').value,
        pTrans: this.form.get('transferee').value,
        pEvent: this.form.get('DescEvent').value,
      };

      let params = {
        ...this.params1.getValue(),
      };

      this.comerEventosService.getLoteExport(body, params).subscribe({
        next: resp => {
          console.log(resp);
          if (resp.data) {
            resolve(resp);
          } else {
            resolve(null);
          }
        },
        error: err => {
          console.log(err);
          this.loading2 = false;
          resolve(null);
        },
      });
    });
  }

  exportInfoLot() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Agregar 1 porque los meses comienzan desde 0
    const day = String(now.getDate()).padStart(2, '0');
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');

    const filename = `Reporte general - ${year}-${month}-${day} ${hour}-${minute}-${second}`;

    if (!this.form.get('typeGood').value) {
      this.alert('warning', 'Debe seleccionar un Tipo de Bien', '');
      return;
    }

    if (!this.form.get('event').value) {
      this.alert('warning', 'Es necesario ingresar un Evento', '');
      return;
    }
    if (!this.form.get('transferee').value) {
      this.alert(
        'warning',
        'Es necesario ingresar una No. de Transferente',
        ''
      );
      return;
    }
    if (!this.form.get('allotment').value) {
      this.alert('warning', 'Es necesario ingresar el No. de Lote', '');
      return;
    }

    if (!this.form.get('DescEvent').value) {
      this.alert(
        'warning',
        'Es necesario ingresar la Descripción del Evento',
        ''
      );
      return;
    }

    let body = {
      pOption: 2, //Cambio de status - 3, historial
      pTypeGood: this.form.get('typeGood').value,
      pEventKey: this.form.get('event').value,
      pLot: this.form.get('allotment').value,
      pTrans: this.form.get('transferee').value,
      pEvent: this.form.get('DescEvent').value,
    };

    let params = {
      ...this.params.getValue(),
    };

    this.comerEventosService.getLoteExport(body, params).subscribe({
      next: resp => {
        const allData = resp.data;
        console.log(allData);
        // Combinar todos los registros en this.line
        this.excelService.export(allData, { filename });
      },
      error: err => {
        console.log(err);
      },
    });
  }

  consult() {
    this.array = [];
    this.dataFormatPercentage = [];
    this.dataFormat = [];
    this.data1.load([]);
    this.data1.refresh();
    this.consultLot();
  }

  async consultLot() {
    let lot = await this.sourceData();
    this.array = lot;
    this.arrayData = this.array.data;
    for (let i = 0; i < this.arrayData.length; i++) {
      if (this.arrayData[i].total > 0) {
        const data: any = {
          id: this.arrayData[i].id,
          name: this.arrayData[i].nombre,
          total: this.arrayData[i].total,
          color: this.arrayData[i].color,
        };
        this.totInvoices =
          Number(this.totInvoices) + Number(this.arrayData[i].total);
        this.dataFormat.push(data);
      }
    }
    console.log(this.totInvoices);
    this.calculatePercentage(this.dataFormat);
  }

  calculatePercentage(data: any) {
    if (this.totInvoices > 0) {
      for (let i = 0; i < data.length; i++) {
        const percentage: number = (data[i].total * 100) / this.totInvoices;
        console.log(percentage);
        const data1: any = {
          id: data[i].id,
          name: data[i].name,
          total: data[i].total,
          color: data[i].color,
          porcentaje: `${Math.round(percentage).toFixed(2)} %`,
        };
        this.dataFormatPercentage.push(data1);
      }

      this.getDataAll();

      console.log(this.dataFormatPercentage);
    } else {
      this.alert(
        'warning',
        'No se Encontraron Facturas',
        `Con los criterios especificados`
      );
    }
  }

  getDataAll() {
    this.loading2 = true;
    if (this.dataFormatPercentage) {
      this.data1.load(this.dataFormatPercentage);
      this.data1.refresh();
      this.totalItems1 = this.dataFormatPercentage.length;
      this.loading2 = false;
      this.show = true;
    }
    /*this.data = this.dataFormatPercentage;
    console.log(this.data);
    this.totalItems = this.data.length;
    console.log(this.totalItems);*/
  }

  sourceOnly() {
    this.loading3 = true;
    if (!this.form2.get('onlyOne').value) {
      this.alert('warning', 'Debe ingresar el No. de Bien', '');
      return;
    }

    let body = {
      pOption: 8, //Cambio de status - 3, historial
      pEvent: this.form2.get('onlyOne').value,
    };

    let params = {
      ...this.params2.getValue(),
    };

    this.comerEventosService.getLoteExport(body, params).subscribe({
      next: resp => {
        console.log(resp);
        this.data2.load(resp.data);
        this.show3 = true;
        this.totalItems2 = resp.count;
        this.loading3 = false;
      },
      error: err => {
        console.log(err);
        this.show3 = false;
      },
    });
  }

  clean() {
    this.form.reset();
    this.show2 = false;
    this.show = false;
  }

  cleanOnlyGodd() {
    this.form2.reset();
    this.show3 = false;
  }

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
      this.propertyValues = this.dataExcel.map((item: any) => item.NO_BIEN);

      // Unir las cadenas con comas para obtener una cadena separada por comas
      this.commaSeparatedString = this.propertyValues.join(',');

      console.log(this.commaSeparatedString);
      console.log(this.dataExcel);
    } catch (error) {
      this.onLoadToast('error', 'Ocurrio un error al leer el archivo', 'Error');
    }
  }

  searchGoodExcel() {
    this.loading4 = true;
    if (!this.commaSeparatedString) {
      this.alert('warning', 'Debe importar el Archivo Excel', '');
      return;
    }

    let body = {
      pOption: 8, //Cambio de status - 3, historial
      pEvent: this.commaSeparatedString,
      ...this.params2.getValue(),
    };

    let params = {
      ...this.params2.getValue(),
    };

    this.comerEventosService.getLoteExport(body, params).subscribe({
      next: resp => {
        console.log(resp);
        this.data2.load(resp.data);
        this.show3 = true;
        this.totalItems2 = resp.count;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  cleanExcel() {
    this.dataExcel = [];

    // Llamar a getEvent sin el filtro
    this.data2.load([]);
  }

  exportCsv() {
    const filename: string = 'Archivo Prueba';
    this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
  }

  showReceipt(event: any) {
    this.modal.show();
    console.log(event.id_evento);

    let body = {
      pOption: 8, //Cambio de status - 3, historial
      pEvent: event.id_evento,
    };

    let params = {
      ...this.params3.getValue(),
    };

    this.comerEventosService.getLoteExport(body, params).subscribe({
      next: resp => {
        console.log(resp);
        this.data3.load(resp.data);
        this.totalItems3 = resp.count;
      },
      error: err => {
        console.log(err);
      },
    });
  }

  cerrarModal() {
    this.modal.hide();
  }
}
