import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from 'src/app/common/repository/interfaces/list-params';
import { ExcelService } from 'src/app/common/services/excel.service';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DelegationService } from 'src/app/core/services/catalogs/delegation.service';
import { DepartamentService } from 'src/app/core/services/catalogs/departament.service';
import { RevisionReasonService } from 'src/app/core/services/catalogs/revision-reason.service';
import { DynamicCatalogsService } from 'src/app/core/services/dynamic-catalogs/dynamiccatalog.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { GoodsReview } from 'src/app/core/services/ms-good/goods-review.service';
import { GoodprocessService } from 'src/app/core/services/ms-goodprocess/ms-goodprocess.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { SegAcessXAreasService } from 'src/app/core/services/ms-users/seg-acess-x-areas.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IGoodsReview } from '../../../../core/models/ms-good/goods-review.model';
import { ListNoAttendedComponent } from '../list-no-attended/list-no-attended.component';
import { COLUMNS } from './columns';
//import { async } from '../../../../common/helpers/helpers';

@Component({
  selector: 'app-goods-review-status',
  templateUrl: './goods-review-status.component.html',
  styles: [],
})
export class GoodsReviewStatusComponent extends BasePage implements OnInit {
  form: FormGroup = new FormGroup({});

  data: LocalDataSource = new LocalDataSource();
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());
  filter1 = new BehaviorSubject<FilterParams>(new FilterParams());
  paramsList = new BehaviorSubject<ListParams>(new ListParams());
  columnFilters: any = [];
  columns: IGoodsReview[] = [];
  delegations = new DefaultSelect();
  delegacionId: any;
  delegationNumber: any = null; // BLK_CONTROL.DELEGACION
  responsable: any = null; // BLK_CONTROL.RESPONSABLE
  responsable2: any = null;
  goodsExcel: any;
  selectedGender: string = 'all';
  jsonToCsv: any[] = [];
  rowSelected: boolean = false;
  selectedRow: any = null;
  selectOnClick: boolean = false;
  permitSelect = true;
  @Output() onSelect = new EventEmitter<any>();
  @ViewChild('file', { static: false }) myInput: ElementRef;
  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private goodsMotivesrev: GoodsReview,
    private departmentService: DepartamentService,
    private excelService: ExcelService,
    private goodService: GoodService,
    private segAcessXAreasService: SegAcessXAreasService,
    private token: AuthService,
    private goodprocessService: GoodprocessService,
    private readonly historyGoodService: HistoryGoodService,
    private delegationService: DelegationService,
    private dynamicCatalogsService: DynamicCatalogsService,
    private modalRef: BsModalRef,
    private revisionReasonService: RevisionReasonService,
    private router: Router,
    private titleService: Title
  ) {
    super();
    this.settings.columns = COLUMNS;
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
    };
  }

  async ngOnInit() {
    this.titleService.setTitle('Atención de Bienes en Estatus REV | SIGEBI');
    this.loading = true;
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
              goodNumber: () => (searchFilter = SearchFilter.EQ),
              motive1: () => (searchFilter = SearchFilter.ILIKE),
              motive2: () => (searchFilter = SearchFilter.ILIKE),
              motive3: () => (searchFilter = SearchFilter.ILIKE),
              motive4: () => (searchFilter = SearchFilter.ILIKE),
              motive5: () => (searchFilter = SearchFilter.ILIKE),
              motive6: () => (searchFilter = SearchFilter.ILIKE),
              motive7: () => (searchFilter = SearchFilter.ILIKE),
              motive8: () => (searchFilter = SearchFilter.ILIKE),
              motive9: () => (searchFilter = SearchFilter.ILIKE),
              motive10: () => (searchFilter = SearchFilter.ILIKE),
              motive11: () => (searchFilter = SearchFilter.ILIKE),
              motive12: () => (searchFilter = SearchFilter.ILIKE),
              motive13: () => (searchFilter = SearchFilter.ILIKE),
              motive14: () => (searchFilter = SearchFilter.ILIKE),
              motive15: () => (searchFilter = SearchFilter.ILIKE),
              motive16: () => (searchFilter = SearchFilter.ILIKE),
              motive17: () => (searchFilter = SearchFilter.ILIKE),
              motive18: () => (searchFilter = SearchFilter.ILIKE),
              motive19: () => (searchFilter = SearchFilter.ILIKE),
              motive20: () => (searchFilter = SearchFilter.ILIKE),
              descriptionGood: () => (searchFilter = SearchFilter.ILIKE),
            };
            // console.log("search.goodId()1", search.goodId())
            // if (search.goodId()) {
            //   console.log("search.goodId()", search.goodId())
            //   search.goodNumber()
            // }
            // console.log("filter.field", search[filter.field])

            search[filter.field]();

            if (filter.search !== '') {
              this.columnFilters[field] = `${searchFilter}:${filter.search}`;
            } else {
              delete this.columnFilters[field];
            }
          });
          this.paramsList = this.pageFilter(this.paramsList);
          //Su respectivo metodo de busqueda de datos
          this.getMotives();
        }
      });

    this.paramsList.pipe(takeUntil(this.$unSubscribe)).subscribe(async () => {
      await this.getDataPupInicializaForma();
      await this.getMotives();
    });

    this.prepareForm();
  }

  handleGenderChange() {
    console.log('Selected gender: ' + this.selectedGender);
    this.loading = true;
    this.paramsList.getValue().limit = 10;
    this.paramsList.getValue().page = 1;
    this.getMotives();
  }

  async getMotives() {
    this.loading = true;
    let params = {
      ...this.paramsList.getValue(),
      ...this.columnFilters,
    };

    if (this.responsable != 'REGIONALES') {
      if (this.selectedGender == 'all') {
        params['filter.attended'] = `$eq:0`;
        params['filter.manager'] = `$eq:${this.responsable}`;
        params['filter.delegation'] = `$eq:${this.delegationNumber}`;
      } else if (this.selectedGender == 'immovables') {
        params['filter.goodType'] = `$eq:I`;
        params['filter.attended'] = `$eq:0`;
        params['filter.manager'] = `$eq:${this.responsable}`;
        params['filter.delegation'] = `$eq:${this.delegationNumber}`;
      } else if (this.selectedGender == 'movables') {
        params['filter.goodType'] = `$eq:M`;
        params['filter.manager'] = `$eq:${this.responsable}`;
        params['filter.attended'] = `$eq:0`;
        params['filter.delegation'] = `$eq:${this.delegationNumber}`;
      }
    } else {
      if (this.responsable == 'REGIONALES' && this.delegationNumber == 0) {
        params['filter.attended'] = `$eq:0`;
        params['filter.manager'] = `$eq:REGIONALES`;
      } else {
        params['filter.attended'] = `$eq:0`;
        params['filter.manager'] = `$eq:REGIONALES`;
        params['filter.delegation'] = `$eq:${this.delegationNumber}`;
      }
    }

    this.goodsMotivesrev.getAll(params).subscribe({
      next: async (response: any) => {
        let result = response.data.map(async (item: any) => {
          const detailsDelegation: any = await this.getDelegation(
            item.delegation
          );
          item['descriptionGood'] = item.goodNumber
            ? item.goodNumber.description
            : null;
          item['goodDetails'] = item.goodNumber;
          item['goodNumber'] = item.goodNumber ? item.goodNumber.id : null;
          item['detailsDelegation'] = detailsDelegation
            ? detailsDelegation.description
            : null;
        });

        Promise.all(result).then(async (resp: any) => {
          // this.columns = response.data;
          this.data.load(response.data);
          this.data.refresh();
          this.totalItems = response.count;
          this.loading = false;
          console.log(response);
        });
      },
      error: err => {
        this.data.load([]);
        this.data.refresh();
        this.totalItems = 0;
        this.loading = false;
      },
    });
  }

  async getDelegation(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    params['filter.phaseEdo'] = `$eq:2`;
    return new Promise((resolve, reject) => {
      this.delegationService.getAll(params).subscribe({
        next: response => {
          console.log('ressss', response);
          // this.loading = false;
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          // this.loading = false;
          console.log(err);
        },
      });
    });
  }

  private prepareForm(): void {
    this.form = this.fb.group({
      option: [null, [Validators.required]],
      responsable: [null],
    });
  }

  showInfo() {}
  shot() {}
  delete(data: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea Eliminar este Registro?'
    ).then(question => {
      if (question.isConfirmed) {
        //Ejecutar el servicio
      }
    });
  }

  settingsChange($event: any): void {
    this.settings = $event;
  }

  // CARGAR EXCEL / CSV //
  onFileChange(event: Event) {
    console.log('event', event);
    const files = (event.target as HTMLInputElement).files;
    if (files.length != 1) throw 'No files selected, or more than of allowed';
    const fileReader = new FileReader();
    fileReader.readAsBinaryString(files[0]);
    fileReader.onload = () => this.readExcel(fileReader.result);
  }

  // LEER EXCEL / CSV //
  async readExcel(binaryExcel: string | ArrayBuffer) {
    try {
      const excelImport = this.excelService.getData<any>(binaryExcel);
      await this.attentionMassive(excelImport);
      // this.data1.load(excelImport);
      // this.showPagination = false;
      // this.totalItems = this.data1.count();
    } catch (error) {
      this.alert('error', 'Ocurrio un Error al leer el Archivo', '');
    }
  }

  // FUNCIÓN DE BOTÓN DE ATENCIÓN MASIVA //
  async attentionMassive(excelImport: any) {
    console.log('excelImport', excelImport);
    if (excelImport.length == 0) {
      this.alert('warning', 'No hay Data Cargada en el Archivo', '');
      return;
    }
    let EXISTE: number = 0;
    let ATENCION = 1;
    let ACTUALIZA = 0;
    let vl_ID_EVENTO = 0;
    let ESTATUSB: number;
    let ESTATUSF: string;
    this.alertQuestion(
      'question',
      '¿Está Seguro de dar por Atendidos los Bienes del Archivo?',
      ''
    ).then(async question => {
      if (question.isConfirmed) {
        // TEXT_IO.GET_LINE(LFIARCHIVO, LST_CADENA);
        // V_NO_BIEN:= GETWORDCSV(LST_CADENA, 1);
        let ArrayNoAtendidos: any = [];
        for (let i = 0; i < excelImport.length; i++) {
          if (excelImport[i].goodNumber != null) {
            EXISTE = 0;
            ATENCION = 1;
            ACTUALIZA = 0;
            vl_ID_EVENTO = 0;

            let obj = {
              goodNumber: excelImport[i].goodNumber,
              attended: 0,
              manager: this.responsable,
            };
            const good: any = await this.getGoodReturn(obj);
            console.log('good', good);

            if (good != null) {
              EXISTE = good.goodNumber.id;
              vl_ID_EVENTO = good.eventId.id;
              ESTATUSB = good.status;
            } else {
              let obj = {
                goodNumber: excelImport[i].goodNumber,
                message: 'Verifique las Condiciones de Atención de Proceso REV',
              };
              ArrayNoAtendidos.push(obj);
              // this.alert(
              //   'warning',
              //   `Verifique las condiciones de atención de proceso REV del bien: ${excelImport[i].goodNumber}`,
              //   ''
              // );
            }

            if (EXISTE > 0) {
              let obj_: any = {
                goodNumber: excelImport[i].goodNumber,
                eventId: good.eventId.id,
                goodType: good.goodType,
                status: good.status,
                manager: this.responsable,
                delegation: good.delegation,
                attended: 1,
              };

              const updateGoodMotivRev: any = await this.updateGoodMotivosRev(
                obj_
              );

              if (updateGoodMotivRev === true) {
                ACTUALIZA = 1;
              } else {
                let obj = {
                  goodNumber: excelImport[i].goodNumber,
                  message: `El Bien: ${excelImport[i].goodNumber} no se pudo Atender en MOTIVOSREV`,
                };
                ArrayNoAtendidos.push(obj);
                // this.alert(
                //   'warning',
                //   `El bien: ${excelImport[i].goodNumber} no se pudo atender en MOTIVOSREV`,
                //   ''
                // );
              }

              let objGood: any = {
                goodNumber: excelImport[i].goodNumber,
                attended: 0,
              };

              const getGoodAttended: any = await this.getGoodAndAttendedReturn(
                objGood
              );
              if (getGoodAttended !== null) {
                ATENCION = getGoodAttended;
              } else {
                ATENCION = 0;
              }

              if (ATENCION == 0 && ACTUALIZA == 1) {
                let objScreen = {
                  goodNumber: excelImport[i].goodNumber,
                  status: ESTATUSB,
                };
                const screenXStatus: any = await this.getScreenXStatus(
                  objScreen
                );

                if (screenXStatus != null) {
                  ESTATUSF = screenXStatus;
                } else {
                  let obj = {
                    goodNumber: excelImport[i].goodNumber,
                    message: `No se Identificó el Estatus Final para el Bien: ${excelImport[i].goodNumber}`,
                  };
                  ArrayNoAtendidos.push(obj);

                  // this.alert(
                  //   'warning',
                  //   `No se identificó el estatus final para el bien: ${excelImport[i].goodNumber}`,
                  //   ''
                  // );
                  ACTUALIZA = 0;
                }

                let objUpdateGood: any = {
                  id: excelImport[i].goodNumber,
                  goodId: excelImport[i].goodNumber,
                  status: ESTATUSF,
                };
                const updateGood: any = await this.updateGoodStatus(
                  objUpdateGood
                );

                if (updateGood == null) {
                  ACTUALIZA = 0;

                  let obj = {
                    goodNumber: excelImport[i].goodNumber,
                    message: `Error al Actualizar el Estatus del Bien: ${excelImport[i].goodNumber}`,
                  };
                  ArrayNoAtendidos.push(obj);

                  // this.alert(
                  //   'error',
                  //   `Error al actualizar el estatus del bien: ${excelImport[i].goodNumber}`,
                  //   ''
                  // );
                }

                if (ACTUALIZA == 1) {
                  var currentDate = new Date();
                  var futureDate = new Date(currentDate.getTime() + 5 * 1000); // A

                  const historyGood: IHistoryGood = {
                    propertyNum: excelImport[i].goodNumber,
                    status: ESTATUSF,
                    changeDate: futureDate,
                    userChange: this.token.decodeToken().preferred_username,
                    statusChangeProgram: 'FMATENCBIENESREV',
                    reasonForChange: 'POR ESTATUS REV MASIVO',
                    registryNum: null,
                    extDomProcess: null,
                  };
                  const insertHistoric: any = await this.putInsertHistoric(
                    historyGood
                  );
                } else {
                  let obj__: any = {
                    goodNumber: excelImport[i].goodNumber,
                    eventId: vl_ID_EVENTO,
                    goodType: good.goodType,
                    status: good.status,
                    manager: this.responsable,
                    delegation: good.delegation,
                    attended: 0,
                  };

                  const updateGoodMotivRev: any =
                    await this.updateGoodMotivosRev(obj__);
                }
              }
            }
          }
        }
        Promise.all(ArrayNoAtendidos).then(async resp => {
          console.log('ArrayNoAtendidos', ArrayNoAtendidos);
          if (ArrayNoAtendidos.length > 0) {
            if (ArrayNoAtendidos.length == excelImport.length) {
              this.alertQuestion(
                'question',
                'Los Bienes del Archivo no se Pudieron Atender',
                '¿Quiere Visualizarlos?'
              ).then(async question => {
                if (question.isConfirmed) {
                  this.openForm(ArrayNoAtendidos);
                }
              });
            } else {
              this.alertQuestion(
                'question',
                'Hay Bienes que no se Pudieron Atender',
                '¿Quiere Visualizarlos?'
              ).then(async question => {
                if (question.isConfirmed) {
                  this.openForm(ArrayNoAtendidos);
                }
              });
              await this.getMotives();
            }
          } else {
            this.alert(
              'success',
              'Todos los Bienes del Archivo Fueron Atendidos',
              ''
            );
            await this.getMotives();
          }
          this.clearInput();
        });
      } else {
        this.clearInput();
      }
    });
  }
  clearInput() {
    this.myInput.nativeElement.value = '';
  }
  // OBTENER - BIENES_MOTIVOSREV
  async getGoodReturn(data: any) {
    const params = new ListParams();
    params['filter.goodNumber'] = `$eq:${data.goodNumber}`;
    params['filter.attended'] = `$eq:${data.attended}`;
    params['filter.manager'] = `$eq:${data.manager}`;
    return new Promise((resolve, reject) => {
      this.goodsMotivesrev.getAll(params).subscribe({
        next: response => {
          console.log('res', response);
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // UPDATE - BIENES_MOTIVOSREV
  async updateGoodMotivosRev(params: any) {
    return new Promise((resolve, reject) => {
      this.goodService.updateGoodsRev(params).subscribe({
        next: response => {
          console.log('res', response);
          resolve(true);
        },
        error: err => {
          resolve(false);
        },
      });
    });
  }

  // OBTENER SOLO GOOD Y ATTENDED - BIENES_MOTIVOSREV
  async getGoodAndAttendedReturn(data: any) {
    const params = new ListParams();
    params['filter.goodNumber'] = `$eq:${data.goodNumber}`;
    params['filter.attended'] = `$eq:${data.attended}`;
    return new Promise((resolve, reject) => {
      this.goodsMotivesrev.getAll(params).subscribe({
        next: response => {
          console.log('res', response);
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // OBTENER STATUS - SCREENXSTATUS
  async getScreenXStatus(data: any) {
    return new Promise((resolve, reject) => {
      this.goodprocessService.getAppliesControl(data).subscribe({
        next: response => {
          console.log('res', response);
          resolve(response.data[0].estatus_nuevo_bien);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // UPDATE - BIENES
  async updateGoodStatus(params: any) {
    return new Promise((resolve, reject) => {
      this.goodService.updateWithParams(params).subscribe({
        next: response => {
          console.log('res', response);
          resolve(true);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // INSERTAR - HISTORY GOOD
  async putInsertHistoric(historyGood: any) {
    return new Promise((resolve, reject) => {
      this.historyGoodService.create(historyGood).subscribe({
        next: response => {
          resolve(true);
          // this.loading = false;
        },
        error: error => {
          resolve(null);
          // this.loading = false;
        },
      });
    });
  }

  // PUP_INICIALIZA_FORMA
  async getDataPupInicializaForma() {
    const user = this.token.decodeToken().username;
    const user2 = this.token.decodeToken().preferred_username;
    const dataUserToolbar: any = await this.getDataUser(user2);
    if (dataUserToolbar != null)
      this.delegationNumber = dataUserToolbar.delegationNumber;

    let obj = {
      otvalor: user,
    };
    const areaCorresp: any = await this.getAreaCorresp(obj);
    if (areaCorresp != null) {
      this.responsable = areaCorresp;

      if (this.responsable === 'JURIDICO') {
        this.responsable2 = 'JURÍDICO';
      } else {
        this.responsable2 = this.responsable;
      }
    } else {
      this.alert('warning', 'Falta Asignar Área Responsable o Delegación.', '');
    }
  }

  // consulta tabla: SEG_ACCESO_X_AREAS
  async getDataUser(user: any) {
    const params = new ListParams();
    params['filter.user'] = `$eq:${user}`;
    params['filter.assigned'] = `$eq:S`;
    return new Promise((resolve, reject) => {
      this.segAcessXAreasService.getAll(params).subscribe({
        next: (resp: any) => {
          console.log('resp', resp);
          const data = resp.data[0];
          resolve(data);
          // this.loading = false;
        },
        error: error => {
          // this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // consulta tabla: TVALTABLA1 -- Esperando endpoint --
  async getAreaCorresp(data: any) {
    return new Promise((resolve, reject) => {
      this.dynamicCatalogsService.getOtValor(data).subscribe({
        next: (resp: any) => {
          console.log('resp', resp);
          const data = resp.data[0].otvalor;
          resolve(data);
          // this.loading = false;
        },
        error: error => {
          // this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // Exporta a excel 'csv'
  async exportar() {
    if (this.data.count() == 0) {
      this.alert('warning', 'No hay Bienes en la Tabla', '');
      return;
    }
    const filename: string = 'Data';
    const jsonToCsv: any = await this.returnJsonToCsv();
    let arr: any = [];
    let result = jsonToCsv.map((item: any) => {
      let obj = {
        NO_BIEN: item.goodNumber,
        EVENTO: item.eventId,
        TIPO_BIEN: item.goodType,
        ESTATUS: item.status,
        RESPONSABLE: item.manager,
        DELEGACION: item.delegation,
        MOTIVO_1: item.motive1,
        MOTIVO_2: item.motive2,
        MOTIVO_3: item.motive3,
        MOTIVO_4: item.motive4,
        MOTIVO_5: item.motive5,
        MOTIVO_6: item.motive6,
        MOTIVO_7: item.motive7,
        MOTIVO_8: item.motive8,
        MOTIVO_9: item.motive9,
        MOTIVO_10: item.motive10,
        MOTIVO_11: item.motive11,
        MOTIVO_12: item.motive12,
        MOTIVO_13: item.motive13,
        MOTIVO_14: item.motive14,
        MOTIVO_15: item.motive15,
        MOTIVO_16: item.motive16,
        MOTIVO_17: item.motive17,
        MOTIVO_18: item.motive18,
        MOTIVO_19: item.motive19,
        MOTIVO_20: item.motive20,
        FECHA_ESTATUS: item.statusDate,
        DESCRIPCION_BIEN: item.descriptionGood,
      };
      arr.push(obj);
    });
    Promise.all(result).then(item => {
      console.log('jsonToCsv', jsonToCsv);
      this.jsonToCsv = arr;
      this.excelService.export(this.jsonToCsv, { type: 'csv', filename });
    });
  }

  async returnJsonToCsv() {
    return this.data.getAll();
    this.data.getAll().then(resp => {
      let arr: any = [];
      let result = resp.map((item: any) => {
        arr.push(item);
      });
      return arr;
    });
  }

  selectRow(row: any) {
    console.log(row);
    this.selectedRow = row.data;
    this.form.get('responsable').setValue(row.data.manager);
    this.rowSelected = true;
  }

  confirm() {
    if (!this.rowSelected) return;
    this.onSelect.emit(this.selectRow);
    this.modalRef.hide();
  }

  async attention() {
    if (!this.selectedRow) {
      this.alert('warning', 'No se ha Seleccionado Ninguna Fila', '');
      return;
    }

    if (!this.selectedRow.goodNumber) {
      this.alert('warning', 'El Número de Bien se Encuentra Vacío', '');
      return;
    }

    let ATENCION: number;
    let ESTATUSF: string;

    this.alertQuestion(
      'question',
      `¿Desea dar por Atendido el Bien: ${this.selectedRow.goodNumber}?`,
      ''
    ).then(async question => {
      if (question.isConfirmed) {
        let obj_: any = {
          goodNumber: this.selectedRow.goodNumber,
          eventId: this.selectedRow.eventId.id,
          goodType: this.selectedRow.goodType,
          status: this.selectedRow.status,
          manager: this.responsable,
          delegation: this.selectedRow.delegation,
          attended: 1,
        };

        const updateGoodMotivRev = await this.updateGoodMotivosRev(obj_);

        if (updateGoodMotivRev == true) {
        } else {
          this.alert(
            'warning',
            `El Bien: ${this.selectedRow.goodNumber} no se pudo Actualizar`,
            ''
          );
          return;
        }

        let objGood: any = {
          goodNumber: this.selectedRow.goodNumber,
          attended: 0,
        };

        const getGoodAttended: any = await this.getGoodAndAttendedReturn(
          objGood
        );
        if (getGoodAttended !== null) {
          ATENCION = getGoodAttended;
        } else {
          ATENCION = 0;
        }

        if (ATENCION == 0) {
          let objScreen = {
            goodNumber: this.selectedRow.goodNumber,
            status: this.selectedRow.status,
          };
          const screenXStatus: any = await this.getScreenXStatus(objScreen);

          if (screenXStatus != null) {
            ESTATUSF = screenXStatus;
          } else {
            ESTATUSF = null;
            this.alert(
              'warning',
              `No se Identificó el Estatus Final para el Bien: ${this.selectedRow.goodNumber}`,
              ''
            );
            return;
          }

          let objUpdateGood: any = {
            id: this.selectedRow.goodNumber,
            goodId: this.selectedRow.goodNumber,
            status: ESTATUSF,
          };
          const updateGood: any = await this.updateGoodStatus(objUpdateGood);

          if (updateGood == null) {
            this.alert(
              'error',
              `Error al Actualizar el Estatus del Bien: ${this.selectedRow.goodNumber}`,
              ''
            );
            return;
          }

          var currentDate = new Date();
          var futureDate = new Date(currentDate.getTime() + 5 * 1000); // A

          const historyGood: IHistoryGood = {
            propertyNum: this.selectedRow.goodNumber,
            status: ESTATUSF,
            changeDate: futureDate,
            userChange: this.token.decodeToken().preferred_username,
            statusChangeProgram: 'FMATENCBIENESREV',
            reasonForChange: 'POR ESTATUS REV MASIVO',
            registryNum: null,
            extDomProcess: null,
          };
          const insertHistoric: any = await this.putInsertHistoric(historyGood);
          console.log('1', insertHistoric);
          if (insertHistoric == null) {
            console.log('2', insertHistoric);
            this.alert(
              'error',
              `Error al Actualizar el Estatus del Bien: ${this.selectedRow.goodNumber}`,
              ''
            );
            return;
          } else {
            console.log('3', insertHistoric);
            this.alert(
              'success',
              `El Bien: ${this.selectedRow.goodNumber} se ha Atendido Correctamente`,
              ''
            );
            this.getMotives();
          }
        } else {
          this.alert(
            'success',
            `El Bien: ${this.selectedRow.goodNumber} se ha Atendido Correctamente`,
            ''
          );
          this.getMotives();
        }
        // -------------------------------------------------------------------------------------------------- //
      }
    });
  }
  clickTimer: any;
  async onDblClick(event: any) {
    console.log('DB', event);
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
      this.clickTimer = null;
      await this.onCellDoubleClick();
    } else {
      this.clickTimer = setTimeout(() => {
        this.clickTimer = null;
      }, 300);
    }
    const rowData = event.data;
    // Acciones de doble clic en la fila
  }
  async onCellDoubleClick() {
    // this.alert("success", "función de doble click activa", "")
    let V_PANTALLA: any,
      V_RESPONSABLE: any,
      V_PARAMETRO: any,
      V_DESCMOTIVO: any = null;
    let V_EXPEDIENTE: any,
      LV_FEC_INSERT: any = null;
    let LV_ADMINISTRA: any,
      LV_RESPONSABLE: any = null;
    let LV_DESC1: any,
      LV_DESC: any = null;
    let motivoTest = 'MotivoTEST';
    let obj = {
      initialStatus: this.selectedRow.status,
      goodType: this.selectedRow.goodType,
      // descriptionCause: motivoTest ¿DE DÓNDE SALE ESTE MOTIVO?
    };
    const getCatMotivosRev_: any = await this.getCatMotivosRev(obj);

    let objGood = {
      goodId: this.selectedRow.goodNumber,
    };
    if (getCatMotivosRev_ === null) {
      V_PANTALLA = null;
      V_RESPONSABLE = null;
      this.alert('warning', `${motivoTest} no es un Motivo Válido`, '');
      return;
    } else {
      V_PANTALLA = getCatMotivosRev_.screen;
      V_RESPONSABLE = getCatMotivosRev_.managerArea;
      V_PARAMETRO = getCatMotivosRev_.parameter;
      V_DESCMOTIVO = getCatMotivosRev_.descriptionCause;
    }

    const getGood_: any = await this.getGood(obj);
    if (getGood_ === null) {
      V_EXPEDIENTE = null;
    } else {
      V_EXPEDIENTE = getGood_.fileNumber;
      LV_FEC_INSERT = getGood_.insertRegDate;
    }

    if (V_RESPONSABLE.includes(this.responsable)) {
      V_RESPONSABLE = this.responsable;
      // Tu código aquí
    }

    // Esperando endpoints
    // LV_ADMINISTRA:= FA_COORD_ADMIN(: BLK_BIENES_MOTIVOSREV.NO_BIEN, V_EXPEDIENTE, LV_FEC_INSERT);
    // LV_RESPONSABLE:= FA_DEL_RESPONSABLE(: BLK_BIENES_MOTIVOSREV.NO_BIEN);

    // ADMINISTRA //
    const getDelegationDB_1: any = await this.getDelegationDB(LV_ADMINISTRA);
    if (getDelegationDB_1 != null) {
      LV_DESC = getDelegationDB_1.description;
    }
    // RESPONSABLE //
    const getDelegationDB_2: any = await this.getDelegationDB(LV_RESPONSABLE);

    if (getDelegationDB_2 != null) {
      LV_DESC1 = getDelegationDB_2.description;
    }

    if (this.responsable == 'REGIONALES') {
      this.alertQuestion(
        'question',
        `El Bien es Administrado por: ${LV_DESC}, y ${LV_DESC1} como Responsable.`,
        '¿Desea Atender el Bien?'
      ).then(async question => {
        if (question.isConfirmed) {
          if (this.delegationNumber == 0 || this.responsable == 'REGIONALES') {
            if (V_PANTALLA != null) {
              if (V_DESCMOTIVO == 'AMPARO') {
                await this.pupLanzaForma(V_PANTALLA, V_PARAMETRO, V_EXPEDIENTE);
              } else {
                await this.pupLanzaForma(
                  V_PANTALLA,
                  V_PARAMETRO,
                  this.selectedRow.goodNumber
                );
              }
            } else {
              this.alert('warning', 'No se Encontró la Pantalla', '');
              return;
            }
          } else if (
            this.delegationNumber == LV_RESPONSABLE ||
            this.delegationNumber == LV_ADMINISTRA
          ) {
            if (V_PANTALLA != null) {
              if (V_DESCMOTIVO == 'AMPARO') {
                await this.pupLanzaForma(V_PANTALLA, V_PARAMETRO, V_EXPEDIENTE);
              } else {
                await this.pupLanzaForma(
                  V_PANTALLA,
                  V_PARAMETRO,
                  this.selectedRow.goodNumber
                );
              }
            } else {
              this.alert('warning', 'No se Encontró la Pantalla', '');
            }
          }
        }
      });
    } else if (this.responsable != 'REGIONALES') {
      if (V_PANTALLA != null) {
        if (V_DESCMOTIVO === 'AMPARO') {
          await this.pupLanzaForma(V_PANTALLA, V_PARAMETRO, V_EXPEDIENTE);
        } else {
          await this.pupLanzaForma(
            V_PANTALLA,
            V_PARAMETRO,
            this.selectedRow.goodNumber
          );
        }
      } else {
        this.alert('warning', 'No se Encontró la Pantalla', '');
        return;
      }
    } else {
      this.alert(
        'warning',
        `No Puede Atender este Bien, ya que Usted no Corresponde al área Responsable: ${V_RESPONSABLE}`,
        ''
      );
      return;
    }
  }

  async getCatMotivosRev(data: any) {
    const params = new ListParams();
    params['filter.initialStatus'] = `$eq:${data.initialStatus}`;
    params['filter.goodType'] = `$eq:${data.goodType}`;
    return new Promise((resolve, reject) => {
      this.revisionReasonService.getAll(params).subscribe({
        next: (resp: any) => {
          console.log('resp', resp);
          const data = resp.data[0];
          resolve(data);
          // this.loading = false;
        },
        error: error => {
          // this.loading = false;
          resolve(null);
        },
      });
    });
  }

  // GET - GOOD
  async getGood(id: any) {
    return new Promise((resolve, reject) => {
      this.goodService.getGoodById(id).subscribe({
        next: response => {
          console.log('res', response);
          resolve(response);
        },
        error: err => {
          resolve(null);
        },
      });
    });
  }

  // CAT_DELEGACIONES
  async getDelegationDB(id: any) {
    const params = new ListParams();
    params['filter.id'] = `$eq:${id}`;
    params['filter.phaseEdo'] = `$eq:2`;
    return new Promise((resolve, reject) => {
      this.delegationService.getAll(params).subscribe({
        next: response => {
          // this.loading = false;
          resolve(response.data[0]);
        },
        error: err => {
          resolve(null);
          // this.loading = false;
          console.log(err);
        },
      });
    });
  }

  // PUP_LANZA_FORMA
  async pupLanzaForma(screen: any, parameter: any, no_bien: any) {
    if (screen == 'FACTJURBIENESXAMP') {
      this.router.navigate(
        [`/pages/juridical/depositary/assignment-protected-assets`],
        {
          queryParams: {
            origin: 'FMATENCBIENESREV',
            P_PARAM_PANT: parameter,
            P_BIEN: no_bien,
          },
        }
      );
    } else if (screen == 'FACTDIRDATOSBIEN') {
      this.router.navigate([`/pages/general-processes/goods-characteristics`], {
        queryParams: {
          origin: 'FMATENCBIENESREV',
          P_PARAM_PANT: parameter,
          P_BIEN: no_bien,
        },
      });
    } else if (screen == 'FIMGFOTBIEADD') {
      // No hay url
      return;
      this.router.navigate([`/pages/general-processes/scan-documents`], {
        queryParams: {
          origin: 'FMATENCBIENESREV',
          P_PARAM_PANT: parameter,
          P_BIEN: no_bien,
        },
      });
    } else if (screen == 'FCAMNOCLASIFBIEN') {
      this.router.navigate(
        [`/pages/administrative-processes/change-of-good-classification`],
        {
          queryParams: {
            origin: 'FMATENCBIENESREV',
            P_PARAM_PANT: parameter,
            P_BIEN: no_bien,
          },
        }
      );
    } else {
      this.alert('warning', 'No se Localizó la URL de la Forma', '');
    }
  }

  openForm(data?: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      data,
      callback: (next: boolean) => {},
    };
    this.modalService.show(ListNoAttendedComponent, modalConfig);
  }

  miFuncion() {
    this.getMotives();
    // console.log('Función ejecutada desde el componente hijo');
  }
}
