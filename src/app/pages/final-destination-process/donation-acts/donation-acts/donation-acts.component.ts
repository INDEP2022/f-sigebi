import { DatePipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import {
  BsDatepickerConfig,
  BsDatepickerViewMode,
} from 'ngx-bootstrap/datepicker';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  filter,
  Observable,
  switchMap,
  takeUntil,
} from 'rxjs';
import { ExpedientService } from 'src/app/core/services/expedients/expedient.service';
import { GoodService } from 'src/app/core/services/good/good.service';
import { DetailProceeDelRecService } from 'src/app/core/services/ms-proceedings/detail-proceedings-delivery-reception.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { ListParams } from './../../../../common/repository/interfaces/list-params';
import { COLUMNS1 } from './columns1';
import { COLUMNS2 } from './columns2';
import { ConfirmationDonationActsComponent } from './confirmation-donation-acts/confirmation-donation-acts.component';

export class GoodsToReception {
  numberProceedings: string;
  numberGood: number;
  amount: number;
}

@Component({
  selector: 'app-donation-acts',
  templateUrl: './donation-acts.component.html',
  styles: [],
})
export class DonationActsComponent extends BasePage implements OnInit {
  //

  actForm: FormGroup;
  formTable1: FormGroup;
  form: FormGroup;
  settings2: any;
  response: boolean = false;
  totalItems: number = 0;
  paramsOne = new BehaviorSubject<ListParams>(new ListParams());
  totalItems2: number = 0;
  params2 = new BehaviorSubject<ListParams>(new ListParams());
  bsValueFromMonth: Date = new Date();
  minModeFromMonth: BsDatepickerViewMode = 'month';
  bsConfigFromMonth: Partial<BsDatepickerConfig>;
  bsValueFromYear: Date = new Date();
  minModeFromYear: BsDatepickerViewMode = 'year';
  bsConfigFromYear: Partial<BsDatepickerConfig>;
  noExpe: string = '';
  avPrevia: string = '';
  caPenal: string = '';
  noTranferente: string = '';
  tiExpe: string = '';
  columns: any[] = [];
  columns2: any[] = [];
  private numSubject: BehaviorSubject<number> = new BehaviorSubject<number>(
    null
  );
  loadingOne: boolean = false;
  loadingTwo: boolean = false;
  num$: Observable<number> = this.numSubject.asObservable();
  datas: LocalDataSource = new LocalDataSource();
  data2: LocalDataSource = new LocalDataSource();
  varOne: string;
  varTwo: string;
  varThree: string;
  varFour: string;
  varFive: string;
  varObjectFinal: any[] = [];
  varObjectFinalModal: any[] = [];
  varCreateObject: any;
  varDeleteObject: any;

  //

  constructor(
    private fb: FormBuilder,
    private expedientService: ExpedientService,
    private serviceGood: GoodService,
    private serviceDetailProceeding: DetailProceeDelRecService,
    private datePipe: DatePipe,
    private cd: ChangeDetectorRef,
    private modalService: BsModalService
  ) {
    super();
    this.settings = {
      ...this.settings,
      hideSubHeader: false,
      actions: false,
      columns: COLUMNS1,
    };
    this.settings2 = { ...this.settings, actions: false, columns: COLUMNS2 };
  }

  ngOnInit(): void {
    this.initForm();
    // this.startCalendars();
    this.paramsOne
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe((params: any) => {
        console.log('Aqui se manda a llamar cuando cambia de pagina');
        this.getDataTableOne(params, `filter.fileNumber=${this.noExpe}`);
      });
    this.params2.pipe(takeUntil(this.$unSubscribe)).subscribe((params: any) => {
      this.getDataTableTwo(params);
    });
  }

  //

  initForm() {
    this.form = this.fb.group({
      no_expediente: [],
      no_transferente: [],
      av_previa: [],
      ca_penal: [],
      ti_expediente: [],
    });

    this.actForm = this.fb.group({
      actSelect: [],
      status: [],
      trans: [],
      don: [],
      es_acta: [],
      cv_acta: [],
      observations: [],
      fec_elaboracion: [],
      nom_entrega: [],
      fec_don: [],
      nom_rec: [],
      dir: [],
      audit: [],
      fol_esc: [],
      tes_con: [],
    });
  }

  settingsChange(event: any, op: number) {
    op === 1 ? (this.settings = event) : (this.settings2 = event);
  }

  getAllBLKByFilters() {
    this.resetFormTwo();
    if (this.noExpe == null || '') {
      this.alert('warning', 'Advertencia', `Por favor ingrese un expediente`);
    } else {
      if (this.noExpe == '' || undefined || null) {
        this.form.reset();
      }
      let params = new HttpParams();
      if (this.noExpe != null) {
        params = params.append('filter.id', this.noExpe);
        this.expedientService.getExpeidentByFilters(params).subscribe({
          next: response => {
            this.form.controls['av_previa'].setValue(
              response.data[0].preliminaryInquiry
            );
            this.form.controls['no_transferente'].setValue(
              response.data[0].transferNumber
            );
            this.form.controls['ca_penal'].setValue(
              response.data[0].criminalCase
            );
            this.form.controls['ti_expediente'].setValue(
              response.data[0].expedientType
            );
          },
          error: error => {
            if (error.status == 400) {
              this.alert(
                'warning',
                'Advertencia',
                `No se encontraron expedientes asociados al número -${this.noExpe}-`
              );
              this.form.reset();
            } else {
              this.alert('error', 'Error', 'Ha ocurrido un error');
              this.form.reset();
            }
          },
        });

        let paramsGoodTwo = new HttpParams();
        paramsGoodTwo = paramsGoodTwo.append('filter.fileNumber', this.noExpe);
        this.getDataTableOne(paramsGoodTwo);

        let paramsRecep = new HttpParams();
        paramsRecep = paramsRecep.append('filter.numFile', this.noExpe);
        this.serviceDetailProceeding
          .getGoodsByProceeding(paramsRecep)
          .subscribe({
            next: response => {
              console.log('Aqui va todo el arreglo inicial: ', response.data);
              this.varObjectFinalModal = response.data;
              this.varObjectFinal = response.data[0];
              this.actForm.controls['actSelect'].setValue(
                response.data[0].keysProceedings
              );
              this.actForm.controls['status'].setValue(response.data[0].id);
              this.numSubject.next(response.data[0].id);
              // this.actForm.controls['trans'].setValue(response.data[0].numTransfer);
              this.actForm.controls['don'].setValue(
                response.data[0].receiptKey
              );
              this.actForm.controls['es_acta'].setValue(
                response.data[0].statusProceedings
              );

              this.varOne = response.data[0].keysProceedings;
              this.varTwo = response.data[0].universalFolio;
              this.varThree = response.data[0].comptrollerWitness;
              this.varFour = response.data[0].statusProceedings;
              this.varFive = response.data[0].id;

              this.actForm.controls['cv_acta'].setValue(
                response.data[0].keysProceedings
              );
              this.actForm.controls['observations'].setValue(
                response.data[0].observations
              );

              let elaborationDate = new Date(response.data[0].elaborationDate);
              let formattedDate = this.datePipe.transform(
                elaborationDate,
                'dd/MM/yyyy'
              );
              this.actForm.controls['fec_elaboracion'].setValue(formattedDate);
              this.actForm.controls['nom_entrega'].setValue(
                response.data[0].witness1
              );

              let elaborationDateTwo = new Date(
                response.data[0].elaborationDate
              );
              let formattedDateTwo = this.datePipe.transform(
                elaborationDateTwo,
                'dd/MM/yyyy'
              );
              this.actForm.controls['fec_don'].setValue(formattedDateTwo);

              this.actForm.controls['nom_rec'].setValue(
                response.data[0].witness2
              );
              this.actForm.controls['dir'].setValue(response.data[0].address);
              this.actForm.controls['audit'].setValue(
                response.data[0].responsible
              );
              this.actForm.controls['fol_esc'].setValue(
                response.data[0].universalFolio
              );
              this.actForm.controls['tes_con'].setValue(
                response.data[0].comptrollerWitness
              );
            },
            error: error => {
              if (error.status == 400) {
                this.alert(
                  'warning',
                  'Advertencia',
                  `No se encontraron registros de actas de entrega recepción`
                );
                this.alert(
                  'warning',
                  'Advertencia',
                  `No se encontraron registros de detalles actas de entrega recepción`
                );
                this.data2.load([]);
                this.actForm.reset();
              } else {
                this.alert('error', 'Error', 'Ha ocurrido un error');
                this.actForm.reset();
                this.data2.load([]);
              }
            },
          });
      }
    }
  }

  closeExp() {
    if (this.noExpe == null || '') {
      this.alert('warning', 'Advertencia', `Por favor ingrese un expediente`);
    } else {
      if (this.varOne == null) {
        this.alert('warning', 'Advertencia', `No existe acta para cerrar`);
      } else if (
        this.actForm.controls['actSelect'].value == null ||
        undefined ||
        ''
      ) {
        // if (this.varTwo == null) {
        //   this.alert('warning', 'Advertencia', `Indique el folio de escaneo`);
        // }
        // if (this.varThree == null) {
        //   this.alert('warning', 'Advertencia', `Indique el Testigo de la Contraloría`);
        // }

        this.alert('warning', 'Advertencia', `No existe acta para cerrar`);
      } else if (this.data2.count() === 0) {
        // if (this.varTwo == null) {
        //   this.alert('warning', 'Advertencia', `Indique el folio de escaneo`);
        // }
        // if (this.varThree == null) {
        //   this.alert('warning', 'Advertencia', `Indique el Testigo de la Contraloría`);
        // }
        this.alert(
          'warning',
          'Advertencia',
          `El acta no tiene ningun bien asignado, no se puede cerrar`
        );
      } else if (this.varFour == 'CERRADA') {
        this.alert('warning', 'Advertencia', `El acta ya esta cerrada`);
      } else {
        let data: any[] = this.varObjectFinalModal;
        let config: ModalOptions = {
          initialState: {
            data,
            callback: (next: boolean) => {
              if (next) console.log('');
            },
          },
          class: 'modal-sl modal-dialog-centered',
          ignoreBackdropClick: true,
        };
        // console.log('Config: ', config);
        const modalRef = this.modalService.show(
          ConfirmationDonationActsComponent,
          config
        );
        modalRef.onHidden.subscribe(() => {
          this.getAllBLKByFilters();
        });
      }
    }
  }

  rowSelectedOne(event: any) {
    this.varCreateObject = event;
    // console.log("Este es el objeto seleccionado: ", event);
  }

  rowSelectedTwo(event: any) {
    this.varDeleteObject = event;
    // console.log("Este es el objeto ELIMINADO: ", event);
  }

  createTableTwo() {
    if (this.varCreateObject == null) {
      this.alert(
        'warning',
        'Advertencia',
        `Seleccione primero el bien a asignar`
      );
    } else {
      if (this.varOne == null) {
        this.alert(
          'warning',
          'Advertencia',
          `No existe un acta, en la cual asignar el bien. capture primero el acta`
        );
      } else {
        if (this.varFour == 'CERRADA') {
          this.alert(
            'warning',
            'Advertencia',
            `El acta ya esta cerrada, no puede realizar modificaciones a esta`
          );
        } else {
          let body: GoodsToReception = new GoodsToReception();
          body.numberGood = this.varCreateObject.data?.id;
          body.numberProceedings = this.varFive;
          body.amount = this.varCreateObject.data?.quantity;
          // console.log("El objeto antes de que se vaya: ", body, " - esto se recibe- ", this.varCreateObject);
          this.serviceDetailProceeding.postRegister(body).subscribe({
            next: response => {
              this.varCreateObject = null;
              this.alert('success', 'Registro creado correctamente', '');
              this.getAllBLKByFilters();
              this.getDataTableTwo();
            },
            error: error => {
              if (error.status == 400) {
                this.alert('warning', 'Advertencia', `El registro ya existe`);
              } else {
                this.alert('error', 'Error', 'Ha ocurrido un error');
              }
            },
          });
        }
      }
    }
  }

  deleteTableTwo() {
    if (this.varDeleteObject == null) {
      this.alert('warning', 'Advertencia', `Debe seleccionar un detalle acta`);
    } else {
      if (this.varDeleteObject.data.numberGood == null) {
        this.alert(
          'warning',
          'Advertencia',
          `Debe seleccionar un bien que forme parte del acta primero`
        );
      } else {
        if (this.varOne == null) {
          this.alert(
            'warning',
            'Advertencia',
            `Debe especificar/buscar el acta para despues eliminar el bien de esta`
          );
        } else {
          if (this.varFour == 'CERRADA') {
            this.alert(
              'warning',
              'Advertencia',
              `El Acta ya Esta cerrada, no puede realizar modificaciones a esta`
            );
          } else {
            let body: GoodsToReception = new GoodsToReception();
            body.numberGood = this.varDeleteObject.data?.numberGood;
            body.numberProceedings =
              this.varDeleteObject.data?.numberProceedings;
            // console.log("El objeto antes de que se vaya: ", body, " - esto se recibe- ", this.varDeleteObject);
            this.serviceDetailProceeding.deleteRegister(body).subscribe({
              next: response => {
                this.varDeleteObject = null;
                this.alert('success', 'Registro eliminado correctamente', '');
                this.getAllBLKByFilters();
                if (this.data2.count() == 1 || 0) {
                  this.data2.load([]);
                }
              },
              error: error => {
                this.alert('error', 'Error', 'Ha ocurrido un error');
              },
            });
          }
        }
      }
    }
  }

  getDataTableOne(param?: HttpParams, filter?: any) {
    if (this.noExpe != '') {
      this.loadingOne = true;
      this.serviceGood.getByFilter(param, filter).subscribe({
        next: response => {
          this.columns = response.data;
          this.datas.load(this.columns);
          this.totalItems = response.count | 0;
          this.datas.refresh();
          this.loadingOne = false;
        },
        error: error => {
          if (error.status == 400) {
            this.alert(
              'warning',
              'Advertencia',
              `No se encontraron registros de bienes`
            );
            this.datas.load([]);
          } else {
            this.alert('error', 'Error', 'Ha ocurrido un error');
            this.datas.load([]);
          }
          this.loadingOne = false;
        },
      });
    }
  }

  getDataTableTwo(params?: any) {
    this.num$
      .pipe(
        filter(num => num !== null),
        switchMap(num =>
          this.serviceDetailProceeding.getGoodsByProceedings(num, params)
        )
      )
      .subscribe({
        next: response => {
          this.varObjectFinal = response.data;
          this.columns2 = response.data;
          this.data2.load(this.columns2);
          this.totalItems2 = response.count || 0;
          this.data2.refresh();
          this.loadingOne = false;
        },
        error: error => {
          this.loadingOne = false;
        },
      });
  }

  resetForm() {
    this.form.reset();
    this.actForm.reset();
    this.datas.load([]);
    this.data2.load([]);
  }

  resetFormTwo() {
    this.actForm.reset();
    this.datas.load([]);
    this.data2.load([]);
  }
  //
}
