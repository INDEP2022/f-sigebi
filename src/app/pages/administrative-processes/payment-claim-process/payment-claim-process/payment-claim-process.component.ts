import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { DocumentsService } from 'src/app/core/services/ms-documents/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { MassiveGoodService } from 'src/app/core/services/ms-massivegood/massive-good.service';
import { ScreenStatusService } from 'src/app/core/services/ms-screen-status/screen-status.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { AnalysisResultModule } from 'src/app/pages/request/economic-compensation/analysis-result/analysis-result.module';
import { ScanningFoilComponent } from '../scanning-foil/scanning-foil.component';
import { TABLE_SETTINGS2 } from './newSettings';
interface IDs {
  goodNumber: number;
}
interface NotData {
  id: number;
  reason: string;
}

@Component({
  selector: 'app-payment-claim-process',
  templateUrl: './payment-claim-process.component.html',
  styles: [
    `
      .custom-table-header {
        height: 0;
        overflow: hidden;
      }
      .table-container {
        max-height: 345px; /* Cambia el valor según tus necesidades */
        overflow-y: auto;
      }
    `,
  ],
})
export class PaymentClaimProcessComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  data: LocalDataSource = new LocalDataSource();
  ids: AnalysisResultModule[];
  goods: any[] = [];
  idsNotExist: NotData[] = [];
  showError: boolean = false;
  showStatus: boolean = false;
  document: any;
  goodClassNumber: string[] = ['1424', '1426', '1427'];
  good: any = null;
  //Reactive Forms
  form: FormGroup;
  disabledImport: boolean = true;
  get justification() {
    return this.form.get('justification');
  }

  numberFolioUniversal: any = '';
  @Output() emitirFolio = new EventEmitter<string>();
  @Output() emitirFolioVal = new EventEmitter<boolean>();
  @ViewChild('hijoRef', { static: false }) hijoRef: ScanningFoilComponent;

  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  settings2 = { ...TABLE_SETTINGS2 };

  valDocument: boolean = false;
  public formLoading: boolean = false;

  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  dataA: any = 0;
  dataD: any = 0;
  paginadoNG: boolean = false;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private excelService: ExcelService,
    private readonly goodServices: GoodService,
    private readonly historyGoodService: HistoryGoodService,
    private readonly screenStatusService: ScreenStatusService,
    private readonly documnetServices: DocumentsService,
    private massiveGoodService: MassiveGoodService
  ) {
    super();
    this.settings = {
      ...this.settings,
      actions: false,
      hideSubHeader: false,
      columns: {
        id: {
          title: 'No. Bien',
          width: '15%',
          sort: false,
        },
        status: {
          title: 'Estatus',
          width: '15%',
          sort: false,
        },
        description: {
          title: 'Descripción',
          width: '40%',
          sort: false,
        },
      },
      rowClassFunction: (row: any) => {
        if (row.data.approved == true) {
          return 'text-approved';
        } else {
          return 'text-no-approved';
        }
      },
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.disable();
    this.data
      .onChanged()
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(change => {
        if (change.action === 'filter') {
          let filters = change.filter.filters;
          filters.map((filter: any) => {
            let field = '';
            //Default busqueda SearchFilter.ILIKE
            let searchFilter = SearchFilter.ILIKE;
            field = `filter.${filter.field}`;

            //Verificar los datos si la busqueda sera EQ o ILIKE dependiendo el tipo de dato aplicar regla de búsqueda
            const search: any = {
              id: () => (searchFilter = SearchFilter.EQ),
              status: () => (searchFilter = SearchFilter.ILIKE),
              description: () => (searchFilter = SearchFilter.ILIKE),
            };

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${filter.search}`;
              // this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.readExcel(this.test, 'no');
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
      this.readExcel(this.test, 'no');
    });

    this.cargarDataStorage();
  }
  test: any;
  async cargarDataStorage() {
    const base64Data = localStorage.getItem('archivoBase64');
    console.log('console.log(base64Data)', base64Data);
    if (base64Data != null) {
      // Decodifica el archivo Base64 a un array de bytes
      const byteCharacters = atob(base64Data);

      // Crea un array de bytes utilizando el tamaño del archivo decodificado
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // Crea un Uint8Array a partir del array de bytes
      const byteArray = new Uint8Array(byteNumbers);

      const blob = new Blob([byteArray], { type: 'text/csv' });
      this.test = blob;
      this.readExcel(blob, 'no');
      this.removeItem('archivoBase64');
    }
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      justification: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      documVal: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
  }

  file: File | undefined;
  fileUrl: any;
  async getFile() {
    const base64Data = localStorage.getItem('goodData');
    const csvData = atob(base64Data);

    return csvData ? csvData : null;
  }

  onFileChange(event: Event) {
    console.log('Entro');
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    // this.alert('success', 'Archivo subido exitosamente', 'Cargado');
    this.readExcel(files[0], 'si');
  }

  readExcel(binaryExcel: string | ArrayBuffer | any, filter: any) {
    try {
      this.loading = true;
      this.idsNotExist = [];
      this.showError = false;
      this.showStatus = false;
      this.data.load([]);
      this.goods = [];
      let params = {
        ...this.paramsList.getValue(),
        ...this.columnFilters,
      };

      if (params['filter.id']) {
        params['id'] = params['filter.id'];
        delete params['filter.id'];
      }

      if (params['filter.status']) {
        params['status'] = params['filter.status'];
        delete params['filter.status'];
      }
      if (params['filter.description']) {
        params['description'] = params['filter.description'];
        delete params['filter.description'];
      }

      // console.log("this.document1", this.document)
      // this.cambiarValor()
      // console.log('SU');
      this.form.get('justification').setValue('');
      this.massiveGoodService.getFProRecPag2CSV(params, binaryExcel).subscribe(
        (response: any) => {
          console.log('filter', filter);
          this.document = null;
          // if (filter != 'no') {
          this.cambiarValor();
          // }

          this.totalItems = response.countA + response.countD;

          let result = response.data.map(async (good: any) => {
            if (good.approved == true) {
              this.disabledImport = false;
              if (!this.form.value.justification) {
                this.form.get('justification').setValue(good.causenumberchange);
              }
            }
          });

          Promise.all(result).then(async (resp: any) => {
            this.paginadoNG = true;
            this.goods = response.data;
            this.data.load(this.goods);

            let aaa: any = null;
            for (let i = 0; i < this.goods.length; i++) {
              if (this.goods[i].approved == true) {
                aaa = this.goods[i];
                break;
              }
            }
            console.log('aaa', aaa);
            this.good = aaa;

            this.cambiarValor3(this.good);
            this.data.refresh();
            this.getDocument(this.goods);
            this.dataA = response.countA;
            this.dataD = response.countD;

            this.test = binaryExcel;
            let file = response.file.base64File;

            this.cargarData(file);

            if (this.good == null) {
              this.form.disable();
            } else {
              this.form.enable();
            }
            console.log('BINARY EXCEL', response);

            if (filter == 'si') {
              this.alert('success', 'Archivo Subido Correctamente', '');
            }

            this.loading = false;
          });
        },
        error => {
          this.data.load([]);
          this.form.disable();
          // this.totalItems = 0;
          this.loading = false;
          if (filter != 'no') {
            this.alert(
              'error',
              'No hay Registros para la Reclamación de pago en el Archivo Cargado.',
              // 'No existen registros disponibles para el proceso de reclamación de pago en el archivo cargado',
              ''
            );
          }
          // this.onLoadToast('warning', 'No hay datos disponibles', '');
        }
      );

      return;
    } catch (error) {
      this.data.load([]);
      this.loading = false;
      this.alert('error', 'Ocurrió un Error al leer el Archivo', '');
    }
  }

  getGoodsWithExcel() {
    this.goods.forEach(async good => {
      // good.status = good.status === 'PRP' ? 'ADM' : 'PRP';
      // this.goodServices.update(this.ids).subscribe({
      //   next: response => {
      //     console.log(response);
      //   },
      //   error: err => {
      //     this.loading = false;
      //     this.idsNotExist.push({ id: good.id, reason: err.error.message });
      //   },
      // });
    });
  }

  changeStatusGood() {
    if (this.goods.length === 0) {
      this.alert('warning', 'Debe Cargar la Lista de Bienes', '');
      return;
    } else if (this.goods.length > 0) {
      let a = false;
      for (let i = 0; i < this.goods.length; i++) {
        if (this.goods[i].approved == true) {
          a = true;
        }
      }

      if (a == false) {
        this.alert('warning', 'No hay Ningún Bien Válido Cargado', '');
        return;
      } else {
        this.validStatusXScreen(this.good);
      }
    }
  }

  async change() {
    let result = this.goods.map(async good => {
      console.log('good', good);
      if (!good.approved) return;
      // good.status = good.status === 'PRP' ? 'ADM' : 'PRP';
      let obj: any = {
        id: good.id,
        goodId: good.id,
        status: good.status,
        causeNumberChange: this.form.value.justification,
      };
      this.goodServices.update(obj).subscribe({
        next: response => {
          console.log(response);
        },
        error: err => {
          this.loading = false;
          this.idsNotExist.push({ id: good.id, reason: err.error.message });
        },
      });
    });
    Promise.all(result).then(resp => {
      this.alert(
        'success',
        'Se ha Actualizado el Motivo de Cambio de los Bienes Válidos',
        ''
      );
    });
    // this.onLoadToast(
    //   'success',
    //   'Actualizado',
    //   'Se ha cambiado el status de los bienes seleccionados'
    // );
    this.addStatus();
    this.showStatus = true;
  }

  async change2() {
    this.goods.forEach(async good => {
      // good.status = good.status === 'PRP' ? 'ADM' : 'PRP';
      if (good.approved == true) {
        let obj: any = {
          id: good.id,
          goodId: good.id,
          status: good.status,
          causeNumberChange: this.form.value.justification,
        };
        this.goodServices.update(obj).subscribe({
          next: response => {
            console.log(response);
          },
          error: err => {
            this.loading = false;
            this.idsNotExist.push({ id: good.id, reason: err.error.message });
          },
        });
      }
    });
    // this.onLoadToast(
    //   'success',
    //   'Se ha actualizado el motivo de cambio de los bienes seleccionados',
    //   ''
    // );
    this.addStatus();
    this.showStatus = true;
  }

  addStatus() {
    this.data.load(this.goods);
    this.data.refresh();
  }

  async loadGood(data: any[]) {
    console.log('data', data);
    this.loading = true;
    let count = 0;
    data.forEach(good => {
      count = count + 1;
      this.goodServices.getById(good.goodNumber).subscribe({
        next: (response: any) => {
          console.log('response', response);

          if (
            response.data[0].status == 'PRP' ||
            response.data[0].status == 'ADM'
          ) {
            // console.log('SI');
            if (
              this.goodClassNumber.includes(
                `${response.data[0].goodClassNumber}`
              )
            ) {
              // console.log(response);
              this.obtenerDocument(response.data[0]);
              this.goods.push(response.data[0]);
              this.disabledImport = false;
              this.addStatus();
            } else {
              this.idsNotExist.push({
                id: response.data[0].id,
                reason: `no cuenta con un número de clasificador válido`,
              });
            }
          } else {
            this.idsNotExist.push({
              id: response.data[0].id,
              reason: `no cuenta con estatus válido, debe ser PRP o ADM`,
            });
          }
        },
        error: err => {
          if (err.error.message === 'No se encontraron registros')
            this.idsNotExist.push({
              id: good.goodNumber,
              reason: err.error.message,
            });
        },
      });
      if (count === data.length) {
        this.loading = false;
        this.showError = true;
      }
    });
    this.form.enable();
  }

  changeFoli(event: any) {
    // console.log('EVENT', event);
    this.document = event;
    this.valDocument = true;
  }

  clean(event: any) {
    this.paramsList.getValue().limit = 10;
    this.paramsList.getValue().page = 1;
    this.totalItems = 0;
    this.paginadoNG = false;
    this.form.disable();
    this.goods = [];
    this.addStatus();
    this.form.reset();
    this.ids = [];
    this.document = null;
    this.showError = false;
    this.disabledImport = true;
    this.valDocument = false;
    this.dataA = 0;
    this.dataD = 0;
    this.cambiarValor();
  }

  // CAMBIAR STATUS DEL BIEN Y ELIMINAR FOLIO DE ESCANEO //
  validStatusXScreen(good: any) {
    // if (this.form.value.justification == null) {
    //   this.alert('info', 'El motivo de cambio se encuentra vacío', '');
    //   return;
    // }
    console.log('good', good);
    this.screenStatusService
      .getStatusXScreen({
        screen: 'FPROCRECPAG',
        status: good.status,
      })
      .subscribe({
        next: response => {
          console.log('response', response);
          console.log(response.data[0].action, good.status);
          if (response.data[0].action == good.status && this.document) {
            this.question();
          } else {
            this.change();
          }
        },
        error: err => {
          this.question();
          console.log(err);
        },
      });
  }

  firstGood(good: any) {
    this.good = good;
  }

  question() {
    this.alertQuestion(
      'question',
      '¿Quiere Continuar con el Proceso?',
      'No Realizó la Actualización de Estatus, el Folio de Escaneo Generado se Eliminará'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
        this.deleteFoli();
      }
    });
  }

  // SE ELIMINA ESCANEO DE FOLIO UNIVERSAL TANTO EL SOLICITADO COMO EL ESCANEADO //
  async deleteFoli() {
    console.log(this.document.id);
    const folioUniversalesReplicados: any = await this.returnFoliosReplicados(
      this.document.id
    );

    if (folioUniversalesReplicados != null) {
      for (let i = 0; i < folioUniversalesReplicados.length; i++) {
        this.documnetServices
          .remove(folioUniversalesReplicados[i].id)
          .subscribe({
            next: response => {},
            error: err => {
              console.log(err);
            },
          });
      }
    }

    this.documnetServices.remove(this.document.id).subscribe({
      next: response => {
        this.change2();
        this.cambiarValor();
        this.document = null;
        this.alert(
          'success',
          'Motivo de Cambio Actualizado y Folio Anterior Eliminado.',
          ''
        );
      },
      error: err => {
        if (err.error.message == 'Este registro no existe!') {
          this.change2();
          this.cambiarValor();
          this.document = null;
          this.valDocument = false;
          this.alert('success', 'Se ha Eliminado Correctamente el Folio', '');
        } else {
          this.alert(
            'error',
            'Se ha Generado un Error al Eliminar el Folio',
            ''
          );
        }
        console.log(err);
      },
    });
  }

  async returnFoliosReplicados(id: any) {
    const params = new ListParams();
    params['filter.associateUniversalFolio'] = `$eq:${id}`;

    return new Promise((resolve, reject) => {
      this.documnetServices.getAll(params).subscribe({
        next: response => {
          resolve(response.data);
        },
        error: err => {
          resolve(null);
          console.log(err);
        },
      });
    });
  }
  // LIMPIAMOS VALOR DEL FOLIO UNIVERSAL A PARTIR DEL COMPONENTE HIJO //
  cambiarValor() {
    this.hijoRef.actualizarVariable(true, '');
  }

  async obtenerDocument(good: any) {
    if (this.valDocument == true) {
      return;
    } else {
      this.hijoRef.getDocument(good);
    }
  }

  // CARGAR DATA EN EL STORAGE PARA REGRESAR A LA PANTALLA CON DATOS CARGADOS //
  cargarData(binaryExcel: any) {
    this.hijoRef.cargarData(binaryExcel);
  }
  async removeItem(key: string) {
    localStorage.removeItem(key);
  }
  async getItem(key: string) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  async getDocument(good: any) {
    let idDoc: any = null;
    for (let i = 0; i < good.length; i++) {
      // this.filter1.getValue().addFilter('scanStatus', 'ESCANEADO', SearchFilter.EQ);

      if (good[i].approved == true) {
        const docss: any = await this.returnDocss(good[i].id);
        console.log('J', idDoc);
        console.log('docss', docss);
        if (docss != null) {
          break;
        }
      }
    }

    // })
  }

  async returnDocss(id: any) {
    this.filter1.getValue().removeAllFilters();
    this.filter1.getValue().addFilter('goodNumber', id, SearchFilter.EQ);

    return new Promise((resolve, reject) => {
      this.documnetServices
        .getAllFilter(this.filter1.getValue().getParams())
        .subscribe({
          next: response => {
            console.log('DOCUMENT', response);
            this.document = response.data[0];

            this.cambiarValor2(false, response.data[0].id);
            resolve(response.data[0].id);
          },
          error: err => {
            console.log(err);

            resolve(null);
          },
        });
    });
  }

  cambiarValor2(val: any, id: any) {
    this.hijoRef.actualizarVariable(val, id);
  }

  cambiarValor3(good: any) {
    this.hijoRef.actualizarVariable2(good);
  }
}
