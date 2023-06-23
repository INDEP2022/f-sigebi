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
import { BehaviorSubject, skip, takeUntil, tap } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IDocuments } from 'src/app/core/models/ms-documents/documents';
import { IGood } from 'src/app/core/models/ms-good/good';
import { DocumentsService } from 'src/app/core/services/ms-documents-type/documents.service';
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
    // .table-container {
    //   overflow-y: auto;
    //   scrollbar-width: thin; /* Anchura del scroll */
    //   scrollbar-color: #888888 #f4f4f4; /* Color del scroll */
    // }

    // .table-container::-webkit-scrollbar {
    //   width: 6px; /* Anchura del scroll */
    // }

    // .table-container::-webkit-scrollbar-thumb {
    //   background-color: #888888; /* Color del scroll */
    //   border-radius: 3px;
    // }

    // .table-container::-webkit-scrollbar-thumb:hover {
    //   background-color: #555555; /* Color del scroll al pasar el mouse */
    // }

    // .table-container::-webkit-scrollbar-track {
    //   background-color: #f4f4f4; /* Color de fondo del scroll */
    // }
    //
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
  document: IDocuments;
  goodClassNumber: string[] = ['1424', '1426', '1427'];
  good: any;
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
          width: '33%',
          sort: false,
        },
        status: {
          title: 'Estatus',
          width: '33%',
          sort: false,
        },
        description: {
          title: 'Descripción',
          width: '33%',
          sort: false,
        },
      },
    };

    this.settings2 = {
      ...TABLE_SETTINGS2,
      actions: false,
      hideSubHeader: true,
      hideHeader: true,
      columns: {
        id: {
          title: 'No. Bien',
          width: '20%',
          sort: false,
        },
        status: {
          title: 'Estatus',
          width: '20%',
          sort: false,
        },
        description: {
          title: 'Descripción',
          width: '60%',
          sort: false,
        },
      },
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.disable();

    // this.params.pipe(takeUntil(this.$unSubscribe)).subscribe(() => {
    //   if (this.goods.length > 0) {
    //     this.loadGoodsPipe();
    //   }
    // });
    this.filter1
      .pipe(
        skip(1),
        tap(() => {
          // aquí colocas la función que deseas ejecutar
          this.readExcel(this.test);
        }),
        takeUntil(this.$unSubscribe)
      )
      .subscribe(() => {
        // if (this.goods.length > 0) {
        // this.readExcel(this.test);
        // }
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
      this.readExcel(blob);
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
    });
  }

  file: File | undefined;
  fileUrl: any;
  async getFile() {
    const base64Data = localStorage.getItem('goodData');
    const csvData = atob(base64Data);

    return csvData ? csvData : null;
    // Puedes utilizar el contenido del archivo CSV como desees
    console.log(csvData);
  }

  // fileContent: string | undefined;
  // converterBase64(event: any) {
  //   const files = event;
  //   const reader = new FileReader();
  //   reader.readAsBinaryString(files);
  //   reader.onloadend = () => {
  //     // Convierte el contenido a Base64
  //     const base64Data = btoa(reader.result as string);

  //     // Guarda el archivo Base64 en el localStorage
  //     this.cargarData(base64Data);
  //     // localStorage.setItem('archivoCSV', base64Data);
  //   };

  //   // this.cargarData();
  // }

  onFileChange(event: Event) {
    console.log('Entro');
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    this.alert('success', 'Archivo subido exitosamente', '');
    // this.converterBase64(files[0])
    // const fileReader = new FileReader();
    // fileReader.readAsBinaryString(files[0]);
    // fileReader.onload = () => this.readExcel(fileReader.result);
    this.readExcel(files[0]);
  }

  readExcel(binaryExcel: string | ArrayBuffer | any) {
    try {
      this.loading = true;
      this.idsNotExist = [];
      this.showError = false;
      this.showStatus = false;
      this.data.load([]);
      // this.filter1.getValue().removeAllFilters();
      this.massiveGoodService
        .getFProRecPag2CSV(this.filter1.getValue().getParams(), binaryExcel)
        .subscribe({
          next: (response: any) => {
            console.log('SI112', response);
            this.goods = response.dataA;
            let dataD = response.dataD;
            let count = 0;
            let arr: any = [];

            // this.goods = dataA;
            // this.valDocument = false;
            if (this.goods.length > 0) {
              this.goods.map(async (goodA: any) => {
                if (this.valDocument == true) {
                  return;
                } else {
                  this.obtenerDocument(goodA);
                }

                this.disabledImport = false;
                this.form
                  .get('justification')
                  .setValue(goodA.causenumberchange);
              });
            }

            // let resultA = dataA.map(async (good: any) => {
            //   count = count + 1;
            //   console.log('SI11', good);
            //   if (good.status == 'PRP' || good.status == 'ADM') {
            //     console.log('SI', good);
            //     if (this.goodClassNumber.includes(`${good.goodclassnumber}`)) {
            //       // console.log(response);
            //       arr.push(good);

            //     }
            //   } else {

            //   }
            // });

            let resultD = dataD.map(async (good: any) => {
              count = count + 1;
              console.log('SI11', good);
              if (good.status == 'PRP' || good.status == 'ADM') {
                console.log('SI', good);
                if (this.goodClassNumber.includes(`${good.goodclassnumber}`)) {
                } else {
                  this.idsNotExist.push({
                    id: good.id,
                    reason: `no cuenta con un número de clasificador válido`,
                  });
                }
              } else {
                console.log('good.status');
                if (good.status) {
                  this.idsNotExist.push({
                    id: good.id,
                    reason: `no cuenta con estatus válido, debe ser PRP o ADM`,
                  });
                } else {
                  this.idsNotExist.push({
                    id: good.id,
                    reason: `no existe en la BD`,
                  });
                }
              }
            });

            Promise.all(resultD).then((resp: any) => {
              console.log('arr', arr);
              // this.goods = arr;
              this.addStatus();

              this.test = binaryExcel;
              console.log('this.test', this.test);
              if (count === dataD.length) {
                this.loading = false;
                this.showError = true;
              }
              let file = response.file.base64File;
              this.cargarData(file);

              this.totalItems = response.countA;

              this.form.enable();

              console.log('BINARY EXCEL', response);

              this.loading = false;
            });
          },
          error: err => {
            this.data.load([]);
            this.loading = false;
            this.onLoadToast('warning', 'No hay datos disponibles', '');
          },
        });

      return;
      this.ids = this.excelService.getData(binaryExcel);
      console.log('this.ids', this.ids);
      // if (this.ids[0].goodNumber === undefined) {
      //   this.onLoadToast(
      //     'error',
      //     'Ocurrió un error al leer el archivo',
      //     'El archivo no cuenta con la estructura requerida'
      //   );
      //   return;
      // }
      this.data.load([]);
      this.goods = [];
      this.idsNotExist = [];
      this.showError = false;
      this.showStatus = false;
      this.loadGood(this.ids);
      // this.form.get('justification').setValue('HOLAAAA')
      this.cargarData(this.ids);

      this.alert('success', 'Archivo subido exitosamente', '');
    } catch (error) {
      this.data.load([]);
      this.alert('error', 'Ocurrio un error al leer el archivo', '');
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
      this.onLoadToast('warning', 'Debe cargar la lista de bienes', '');
      return;
    }
    this.validStatusXScreen(this.good);
  }

  async change() {
    this.goods.forEach(async good => {
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
    this.onLoadToast(
      'success',
      'Actualizado',
      'Se ha cambiado el status de los bienes seleccionados'
    );
    this.addStatus();
    this.showStatus = true;
  }

  async change2() {
    this.goods.forEach(async good => {
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
    this.onLoadToast(
      'success',
      'Se ha actualizado el motivo de cambio de los bienes seleccionados',
      ''
    );
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
    console.log('EVENT', event);
    this.document = event;
    this.valDocument = true;
  }

  clean(event: any) {
    this.form.disable();
    this.goods = [];
    this.addStatus();
    this.form.reset();
    this.ids = [];
    this.document = null;
    this.showError = false;
    this.disabledImport = true;
    this.valDocument = false;
    this.cambiarValor();
  }

  // CAMBIAR STATUS DEL BIEN Y ELIMINAR FOLIO DE ESCANEO //
  validStatusXScreen(good: IGood) {
    // if (this.form.value.justification == null) {
    //   this.alert('info', 'El motivo de cambio se encuentra vacío', '');
    //   return;
    // }
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

  firstGood(good: IGood) {
    this.good = good;
  }

  question() {
    this.alertQuestion(
      'question',
      '¿Quiere continuar con el proceso?',
      'No realizó la actualización de estatus, el folio de escaneo generado se eliminará'
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
          .delete(folioUniversalesReplicados[i].id)
          .subscribe({
            next: response => {},
            error: err => {
              console.log(err);
            },
          });
      }
    }

    this.documnetServices.delete(this.document.id).subscribe({
      next: response => {
        this.change2();
        this.cambiarValor();
        this.document = null;
        this.alert('success', 'Se ha eliminado correctamente el folio', '');
      },
      error: err => {
        if (err.error.message == 'Este registro no existe!') {
          this.change2();
          this.cambiarValor();
          this.document = null;
          this.valDocument = false;
          this.alert(
            'success',
            'Elimiado',
            'Se ha eliminado correctamente el folio'
          );
        } else {
          this.alert(
            'error',
            'Elimiado',
            'Se ha generado un error al eliminar el Folio'
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

  obtenerDocument(good: any) {
    if (this.valDocument == true) {
      return;
    } else {
      console.log('this.document', this.document);
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
}