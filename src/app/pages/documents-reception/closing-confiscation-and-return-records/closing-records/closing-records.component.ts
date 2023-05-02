import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import {
  BehaviorSubject,
  catchError,
  EMPTY,
  firstValueFrom,
  map,
  of,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { MODAL_CONFIG } from 'src/app/common/constants/modal-config';
import { IListResponse } from 'src/app/core/interfaces/list-response.interface';
import { IHistoryGood } from 'src/app/core/models/administrative-processes/history-good.model';
import { IDetailProceedingsDevolution } from 'src/app/core/models/ms-proceedings/detail-proceedings-devolution.model';
import { IProceedings } from 'src/app/core/models/ms-proceedings/proceedings.model';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { DocumentsService } from 'src/app/core/services/ms-documents-type/documents.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { HistoryGoodService } from 'src/app/core/services/ms-history-good/history-good.service';
import { ParametersService } from 'src/app/core/services/ms-parametergood/parameters.service';
import { DetailProceedingsDevolutionService } from 'src/app/core/services/ms-proceedings/detail-proceedings-devolution';
import { ProceedingsService } from 'src/app/core/services/ms-proceedings/proceedings.service';
import { BasePage } from 'src/app/core/shared/base-page';
import {
  FilterParams,
  ListParams,
  SearchFilter,
} from './../../../../common/repository/interfaces/list-params';
import { showHideErrorInterceptorService } from './../../../../common/services/show-hide-error-interceptor.service';
import { IGood } from './../../../../core/models/ms-good/good';
import { IMaximumClosingTime } from './../../../../core/models/ms-proceedings/maximum-closing-time.model';
import { IUpdateProceedings } from './../../../../core/models/ms-proceedings/update-proceedings.model';
import { AccountMovements } from './../../../../core/services/ms-account-movements/account-movements.service';
import { MaximunClosingTimeService } from './../../../../core/services/ms-proceedings/maximun-closing-time.service';
import { ScreenStatusService } from './../../../../core/services/ms-screen-status/screen-status.service';
import { FormEditComponent } from './../form-edit/form-edit.component';
import { GOODS_RECORDS_COLUMNS } from './closing-records-columns';
import { PROCEEDINGS_RECORD_COLUMNS } from './proceedings-records-columns';

export interface IMaximunClosingTime {
  type: string | null;
  user: string | null;
  active: string | null;
  date: Date | null;
}

@Component({
  selector: 'app-closing-records',
  templateUrl: './closing-records.component.html',
  styles: [],
})
export class ClosingRecordsComponent extends BasePage implements OnInit {
  @ViewChild('closeButton') closeButton: ElementRef;
  form: FormGroup;
  screenName: string = '';
  statusAct: string = 'ABIERTA';
  settings2: any;
  flag: boolean = false;
  firsTime: boolean = true;
  record: IUpdateProceedings;
  dataResp: IProceedings;
  dataTable: any[] = [];
  fileNumber: number;
  fileNumberRoute: number;
  proceedingsNumb: number;
  proceedingsKey: string;
  di_clasif_numerario: number;
  dataForm: any;
  copyDataProceedings: any;
  proceedingsData: any[] = [];
  proceedingsData2: any[] = [];
  paramsProceedings = new BehaviorSubject<ListParams>(new ListParams());
  paginatorProceedings: any = {};
  paramsGoods = new BehaviorSubject<ListParams>(new ListParams());
  filterParams = new BehaviorSubject<FilterParams>(new FilterParams());
  paginatorGoods: any = {};
  totalProceedings: number = 0;
  totalGoods: number = 0;
  selectedProceedings: boolean = false;
  dataProceedingsSelected: any;
  reconciledAssetsAndNumerary: any[] = [];
  quantityOfGoods: number;
  userInfo: string;
  inputValue: string | number;
  historyGoodFailed: any[]; //usado para llevar un log de las inserciones de histórico de bienes fallidas
  updateGoodFalied: any[]; //usado para llevar un log de las actualicaciones de bienes fallidas

  constructor(
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private proceedingsService: ProceedingsService,
    private detailProceedingsDevolutionService: DetailProceedingsDevolutionService,
    private documentService: DocumentsService,
    private maximunClosingTimeService: MaximunClosingTimeService,
    private parametersService: ParametersService,
    private screenStatusService: ScreenStatusService,
    private goodService: GoodService,
    private historyGood: HistoryGoodService,
    private accountMovements: AccountMovements,
    private showHideErrorInterceptorService: showHideErrorInterceptorService,
    private modalService: BsModalService,
    private token: AuthService,
    private route: Router
  ) {
    super();
    this.settings2 = this.settings;
    this.settings2.columns = PROCEEDINGS_RECORD_COLUMNS;
    this.settings2.actions.delete = true;
    this.settings = {
      ...this.settings,
      actions: false,
      columns: GOODS_RECORDS_COLUMNS,
    };
  }

  getParams() {
    this.activatedRoute.params.subscribe(params => {
      this.fileNumberRoute = params['fileNumber'];
      console.log(this.fileNumber);
      if (this.fileNumberRoute) {
        this.fileNumber = this.fileNumberRoute;
        this.inputValue = this.fileNumberRoute;
        this.search(Number(this.fileNumber));
        console.log(this.fileNumberRoute);
      }
    });
  }

  get proceedingsCve() {
    return this.form.get('proceedingsCve');
  }

  editProceeding(proceeding: IProceedings) {
    console.log(proceeding);
    console.log(this.copyDataProceedings);
    const found = this.copyDataProceedings.find(
      (element: IProceedings) => element.id == proceeding.id
    );
    console.log(found);
    this.openForm(found);
  }

  ngOnInit(): void {
    console.log(this.firsTime);
    this.prepareForm();
    this.initPaginatorProceedings();
    this.initPaginatorGoods();
    this.getParams();
    this.getInfoToken();
    this.getScreenName();
    this.getParamCve();
  }

  search(
    fileNumber: string | number,
    paginatedProceedings?: { page: number; limit: number },
    paginatedGoods?: { page: number; limit: number }
  ) {
    this.dataTable = [];
    this.proceedingsData = [];
    this.fileNumber = Number(fileNumber);
    console.log(this.activatedRoute);
    this.route.navigate(
      [
        '/pages/documents-reception/closing-of-confiscation-and-return-records',
        `${fileNumber}`,
      ],
      {
        relativeTo: this.activatedRoute,
      }
    );

    this.firsTime = true;
    this.resetGoodsPaginator(paginatedGoods);
    this.resetProceedingssPaginator(paginatedProceedings);
    this.cleanForm();
    this.getInfo(this.fileNumber);
  }

  getInfoToken() {
    this.userInfo = this.token.decodeToken().preferred_username;
  }

  deleteExpedient() {
    if (this.proceedingsData.length >= 1) {
      this.onLoadToast(
        'info',
        'Info',
        'No puede eliminar el expediente debido a que tiene actas.'
      );
    } else {
      console.log('Eliminando expediente...');
    }
  }

  deleteProceedings(proceeding: any) {
    console.log(proceeding);
    console.log('deleteProeedings');
    this.getGoods(proceeding.data?.id)
      .pipe(
        catchError(err => {
          if (err.status == 400) {
            this.showHideErrorInterceptorService.showHideError(false);
            this.proceedingsService.remove(proceeding.data?.id).subscribe({
              next: () => {
                this.onLoadToast(
                  'success',
                  'Acta Eliminada',
                  'El acta ha sido eliminada exitosamente'
                );
                setTimeout(() => {
                  this.getInfo(this.fileNumber);
                }, 2000);
              },
              error: err => {
                this.onLoadToast('error', 'Error', err.message);
              },
            });
          }
          return EMPTY;
        })
      )
      .subscribe({
        next: (data: any) => {
          this.onLoadToast(
            'error',
            'Error',
            'El acta no puede ser eliminada debido a que cuenta con bienes'
          );
        },
        error: err => {
          this.onLoadToast('error', 'Error', err.message);
        },
      });
  }

  showDeleteAlert(proceedings: any) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar esta acta?'
    ).then(question => {
      if (question.isConfirmed) {
        this.deleteProceedings(proceedings);
        // Swal.fire('Acta borrada exitosamente', '', 'success');
      }
    });
  }

  openForm(proceeding: any) {
    const modalConfig = MODAL_CONFIG;
    modalConfig.initialState = {
      proceeding,
      title: 'Actualizar Acta',
      callback: (next: boolean) => {
        this.getInfo(this.fileNumber);
      },
    };
    this.modalService.show(FormEditComponent, modalConfig);
  }

  getParamCve() {
    this.parametersService.getById('CLASINUMER').subscribe({
      next: (data: any) => {
        console.log(data);
        this.di_clasif_numerario = Number(data.initialValue);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  cleanForm() {
    this.form.get('previewFind').setValue('');
    this.form.get('penaltyCause').setValue('');
  }

  initPaginatorProceedings() {
    console.log('Inicio');
    this.paramsProceedings
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(data => {
        this.paginatorProceedings.page = data.page;
        this.paginatorProceedings.limit = data.limit;
        console.log(this.paginatorProceedings);
        console.log(`Init Paginator ${data.page} ${data.limit}`);
        if (!this.firsTime) {
          this.getProceedings(this.fileNumber).subscribe((data: any) => {
            this.prepareProceedingsData(data);
          });
        }
      });
  }

  initPaginatorGoods() {
    this.paramsGoods.pipe(takeUntil(this.$unSubscribe)).subscribe(data => {
      console.log(2);
      this.paginatorGoods.page = data.page;
      this.paginatorGoods.limit = data.limit;
      if (!this.firsTime) {
        console.log('XXXX');
        this.getGoods(this.proceedingsNumb).subscribe((data: any) => {
          this.prepareGoodsData(data);
        });
      }
    });
  }

  resetGoodsPaginator(paginated = { page: 1, limit: 10 }) {
    this.paramsGoods.next(paginated);
  }

  resetProceedingssPaginator(paginated = { page: 1, limit: 10 }) {
    this.paramsProceedings.next(paginated);
  }

  selectProceedings(row: any) {
    this.dataTable = [];
    this.dataProceedingsSelected = row;
    console.log(row);
    console.log(this.dataProceedingsSelected);
    this.selectedProceedings = true;
    console.log('Seleccionar Acta', row);
    // this.paramsGoods.next({ page: 1, limit: 10 });
    console.log(row?.id);
    this.proceedingsNumb = row?.id;
    this.paramsGoods.next({ page: 1, limit: 10 });
  }

  getProceedings(fileNumber: number) {
    this.selectedProceedings = false;
    return this.proceedingsService.getActByFileNumber(
      fileNumber,
      this.paginatorProceedings
    );
  }

  getGoods(proceedingsNumb: number) {
    console.log(proceedingsNumb);
    return this.detailProceedingsDevolutionService.getDetailProceedingsDevolutionByProceedingsNumb(
      proceedingsNumb,
      this.paginatorGoods
    );
  }

  getInfo(fileNumber: number) {
    this.flag = false;
    this.firsTime = false;
    this.getProceedings(fileNumber)
      .pipe(
        tap((data: IListResponse<IProceedings>) => {
          this.proceedingsNumb = data.data[0].id; // se asignan estos valores para luego pasarlos a la pantalla de validadores de actas
          this.proceedingsKey = data.data[0].proceedingsCve;
        }),
        catchError(err => {
          this.handleError(
            err,
            'No se han encontrado registros para este expediente'
          );
          return EMPTY;
        }),
        switchMap((proceedings: IListResponse<IProceedings>) =>
          this.getGoods(proceedings.data[0].id).pipe(
            tap(resp => console.log(resp)),
            catchError(err => {
              this.handleError(
                err,
                'No existen bienes asociados a este número de expediente'
              );
              return of(err);
            }),
            map((goods: any) => ({
              proceedings,
              goods,
            }))
          )
        )
      )
      .subscribe({
        next: data => {
          this.firsTime = false;
          this.prepareData(data);
          this.totalProceedings = Number(data.proceedings.count);
          this.totalGoods = Number(data.goods.count);
          console.log(this.totalGoods);
        },
        error: error => {
          console.log(error);
        },
      });
  }

  handleError(error: HttpErrorResponse, msg: string) {
    if (error.status <= 404) {
      this.onLoadToast('info', 'Información', msg);
    }
  }

  prepareData(data: {
    proceedings: IListResponse<IProceedings>;
    goods: IListResponse<IDetailProceedingsDevolution>;
  }) {
    console.log(data);
    this.proceedingsData = [];
    this.proceedingsData2 = [];
    let proceedingsTemp: any;
    let expedientInfo: any = {};
    this.dataResp = data.proceedings.data[0];
    // this.statusAct = 'ABIERTA';
    // this.statusAct = this.dataResp.proceedingStatus;          //DESCOMENTAR ESTO
    expedientInfo.penaltyCause =
      data.proceedings.data[0].fileNumber.penaltyCause;
    expedientInfo.previewFind = data.proceedings.data[0].fileNumber.previewFind;
    this.form.patchValue(expedientInfo);
    this.prepareProceedingsData(data.proceedings);
    // this.proceedingsData = this.proceedingsData2;
    if (!data.goods.hasOwnProperty('error')) {
      this.prepareGoodsData(data.goods);
    }
    // this.form.patchValue(this.dataForm);
    this.flag = true;
  }

  prepareProceedingsData(data: IListResponse<IProceedings>) {
    let proceedingsTemp: any;
    this.copyDataProceedings = data.data;
    for (let proceedings of data.data) {
      proceedingsTemp = {
        id: proceedings.id,
        proceedingStatus: proceedings.proceedingStatus,
        proceedingsCve: proceedings.proceedingsCve,
        elaborationDate: this.convertDate(proceedings.elaborationDate),
        authorityOrder: proceedings.authorityOrder,
        proceedingsType: proceedings.proceedingsType,
        universalFolio: proceedings.universalFolio,
        observations: proceedings.observations,
      };
      console.log(proceedingsTemp.universalFolio);
      this.proceedingsData.push(proceedingsTemp);
    }
  }

  prepareGoodsData(data: IListResponse<IDetailProceedingsDevolution>) {
    this.quantityOfGoods = data.count;
    let goodsData: any[] = [];
    for (let good of data.data) {
      let data: any = {
        goodsId: good.good[0].goodsID,
        description: good.good[0].description,
        quantity: good.good[0].quantity,
        amountReturned: good.amountReturned,
      };
      goodsData.push(data);
    }
    this.dataTable = goodsData;
  }

  enableDisableFields(option: string) {
    //habilitar / deshabilitar formulario
    Object.keys(this.form.controls).forEach(key => {
      if (option === 'CERRADA') this.form.controls[key].disable();
      else this.form.controls[key].enable();
    });
  }

  convertDate(date: Date) {
    return new Date(date).toLocaleDateString().toString();
  }

  closeProceedings() {
    console.log(this.dataProceedingsSelected.id);
    var maximunClosingTime: IMaximumClosingTime;
    console.log(this.dataProceedingsSelected.proceedingStatus);
    if (this.dataProceedingsSelected.proceedingStatus == 'CERRADA') {
      this.onLoadToast('error', 'Error', 'El acta ya se encuentra cerrada');
    } else {
      this.processCloseProceeding();
    }
  }

  reloadPage(
    fileNumber: number,
    paginatedProceedings: { page: number; limit: number },
    paginatedGoods: { page: number; limit: number }
  ) {
    this.search(fileNumber, paginatedProceedings, this.paginatorGoods);
  }

  async processCloseProceeding() {
    let proceedingUpdated: boolean = false;
    try {
      if (this.dataTable.length > 0) {
        let maximunClosingTime: any = await this.getMaximunClosingTime()
          .then()
          .catch(error => {
            throw this.verifyError(error, error.message);
          });
        if (this.validateClosingDate(maximunClosingTime?.date)) {
          if (this.dataProceedingsSelected.universalFolio != '') {
            let scanned: any = await this.getScannedDocument()
              .then(data => {})
              .catch(error => {
                console.log(error);
                throw this.verifyError(
                  error,
                  'El acta no puede ser cerrada debido a que el estatus del documento es diferente de ESCANEADO'
                );
              });
            let totalReconciledGoods: any = await this.getTotalReconciledGoods(
              this.proceedingsNumb
            )
              .then()
              .catch(error => {
                throw this.verifyError(error, error.message);
              });
            if (totalReconciledGoods.total == this.quantityOfGoods) {
              let dataToUpdate: any = this.buildObjectToUpdate('CERRADA');
              await this.updateProceeding(dataToUpdate)
                .then(data => {
                  proceedingUpdated = true;
                  console.log(`Acta actualizada: ${proceedingUpdated}`);
                })
                .catch(error => {
                  throw this.verifyError(
                    error,
                    'Ha ocurrido un erorr al intentar actualizar el acta, intente de nuevo'
                  );
                });
              let allGoods: any = await this.getAllGoods()
                .then()
                .catch(error => {
                  throw this.verifyError(
                    error,
                    'Ha ocurrido un error al obtener la lista de bienes'
                  );
                });
              console.log(allGoods?.data?.length);
              console.log(allGoods?.data);
              //TODO: HACER MAP CON allGoods?.data
              /*let goods:any = [
                {
                  "id": 21378,
                  "inventoryNumber": null,
                  "goodId": "192273",
                  "description": "NUMERARIO POR LA CANTIDAD DE $980.00 (NOVECIENTOS OCHENTA PESOS 00/100 M.N.)",
                  "quantity": "1.000",
                  "dateIn": null,
                  "dateOut": null,
                  "expireDate": null,
                  "ubicationType": null,
                  "status": "ABT",
                  "goodCategory": null,
                  "originSignals": null,
                  "registerInscrSol": null,
                  "dateOpinion": null,
                  "proficientOpinion": null,
                  "valuerOpinion": null,
                  "opinion": null,
                  "appraisedValue": "980.00",
                  "drawerNumber": null,
                  "vaultNumber": null,
                  "goodReferenceNumber": "192273",
                  "appraisalCurrencyKey": "MN",
                  "appraisalVigDate": null,
                  "legalDestApprove": null,
                  "legalDestApproveUsr": null,
                  "legalDestApproveDate": null,
                  "complianceLeaveDate": null,
                  "complianceNotifyDate": null,
                  "leaveObservations": null,
                  "judicialLeaveDate": null,
                  "notifyDate": null,
                  "notifyA": null,
                  "placeNotify": null,
                  "discardRevRecDate": null,
                  "resolutionEmissionRecRevDate": null,
                  "admissionAgreementDate": null,
                  "audienceRevRecDate": null,
                  "revRecObservations": null,
                  "leaveCause": null,
                  "resolution": null,
                  "fecUnaffordability": null,
                  "unaffordabilityJudgment": null,
                  "userApproveUse": null,
                  "useApproveDate": null,
                  "useObservations": null,
                  "dateRequestChangeNumerary": null,
                  "numberChangeRequestUser": null,
                  "causeNumberChange": null,
                  "changeRequestNumber": null,
                  "authNumberChangeDate": null,
                  "authChangeNumberUser": null,
                  "authChangeNumber": null,
                  "numberChangeRatifiesDate": null,
                  "numberChangeRatifiesUser": null,
                  "notifyRevRecDate": null,
                  "revRecCause": null,
                  "initialAgreement": null,
                  "observations": null,
                  "fileNumber": "215675",
                  "associatedFileNumber": "215675",
                  "rackNumber": null,
                  "storeNumber": null,
                  "lotNumber": null,
                  "goodClassNumber": 62,
                  "subDelegationNumber": 7,
                  "delegationNumber": 7,
                  "physicalReceptionDate": "2014-08-12T00:00:00.000Z",
                  "statusResourceReview": null,
                  "judicialDate": null,
                  "abandonmentDueDate": null,
                  "destructionApproveDate": null,
                  "destructionApproveUser": null,
                  "observationDestruction": null,
                  "destinyNumber": null,
                  "registryNumber": "2995050",
                  "agreementDate": "2005-02-24T00:00:00.000Z",
                  "state": null,
                  "opinionType": null,
                  "presentationDate": null,
                  "revRecRemedyDate": null,
                  "receptionStatus": null,
                  "promoterUserDecoDevo": null,
                  "scheduledDateDecoDev": null,
                  "goodsPartializationFatherNumber": null,
                  "seraAbnDeclaration": null,
                  "identifier": "ASEG",
                  "siabiInventoryId": null,
                  "cisiPropertyId": null,
                  "siabiInvalidId": null,
                  "tesofeDate": null,
                  "tesofeFolio": null,
                  "situation": null,
                  "labelNumber": "7",
                  "flyerNumber": "798925",
                  "insertRegDate": "2005-05-04T00:00:00.000Z",
                  "visportal": null,
                  "unit": "PIEZA",
                  "referenceValue": null,
                  "insertHcDate": null,
                  "extDomProcess": "ABANDONO",
                  "requestId": null,
                  "goodTypeId": null,
                  "subTypeId": null,
                  "goodStatus": "EN_RECEPCION",
                  "idGoodProperty": null,
                  "requestFolio": null,
                  "type": null,
                  "admissionDate": null,
                  "locationId": null,
                  "uniqueKey": null,
                  "fileeNumber": null,
                  "goodDescription": null,
                  "physicalStatus": null,
                  "unitMeasure": null,
                  "ligieUnit": null,
                  "quantityy": null,
                  "destiny": null,
                  "appraisal": null,
                  "notesTransferringEntity": null,
                  "fractionId": null,
                  "federalEntity": null,
                  "stateConservation": null,
                  "armor": null,
                  "brand": null,
                  "subBrand": null,
                  "model": null,
                  "axesNumber": null,
                  "engineNumber": null,
                  "tuition": null,
                  "serie": null,
                  "chassis": null,
                  "cabin": null,
                  "volume": null,
                  "origin": null,
                  "useType": null,
                  "manufacturingYear": null,
                  "capacity": null,
                  "operationalState": null,
                  "enginesNumber": null,
                  "dgacRegistry": null,
                  "airplaneType": null,
                  "flag": null,
                  "openwork": null,
                  "length": null,
                  "sleeve": null,
                  "shipName": null,
                  "publicRegistry": null,
                  "ships": null,
                  "caratage": null,
                  "material": null,
                  "weight": null,
                  "satFile": null,
                  "satClassificationId": null,
                  "satSubclassificationId": null,
                  "satGuideMaster": null,
                  "satGuideHouse": null,
                  "satDepartureNumber": null,
                  "satAlmAddress": null,
                  "satAlmColony": null,
                  "satAlmCityPopulation": null,
                  "satAlmMunicipalityDelegation": null,
                  "satAlmFederativeEntity": null,
                  "satAddressDelivery": null,
                  "satBreaches": null,
                  "userCreation": null,
                  "creationDate": null,
                  "userModification": null,
                  "modificationDate": null,
                  "ligieSection": null,
                  "ligieChapter": null,
                  "ligieLevel1": null,
                  "ligieLevel2": null,
                  "ligieLevel3": null,
                  "ligieLevel4": null,
                  "satUniqueKey": null,
                  "unfair": null,
                  "platesNumber": null,
                  "clarification": null,
                  "reprogrammationNumber": null,
                  "reasonCancReprog": "1",
                  "storeId": null,
                  "instanceDate": null,
                  "processStatus": "REGISTRO_SOLICITUD",
                  "version": null,
                  "observationss": null,
                  "addressId": null,
                  "compliesNorm": null,
                  "descriptionGoodSae": null,
                  "quantitySae": "1",
                  "saeMeasureUnit": "A",
                  "saePhysicalState": "1",
                  "stateConservationSae": "1",
                  "programmationStatus": "EN_TRANSPORTABLE",
                  "executionStatus": "EN_RECEPCION",
                  "duplicity": null,
                  "duplicatedGood": null,
                  "compensation": null,
                  "validateGood": null,
                  "ebsStatus": null,
                  "concurrentNumber": null,
                  "concurrentMsg": null,
                  "fitCircular": null,
                  "theftReport": null,
                  "transferentDestiny": null,
                  "saeDestiny": "1",
                  "rejectionClarification": null,
                  "goodResdevId": null,
                  "indClarification": "N",
                  "msgSatSae": null,
                  "color": null,
                  "doorsNumber": null,
                  "destinationRedress": null,
                  "val1": "MN",
                  "val2": "980",
                  "val3": null,
                  "val4": "BITAL",
                  "val5": "28-02-2005",
                  "val6": "4024745242",
                  "val7": null,
                  "val8": null,
                  "val9": null,
                  "val10": null,
                  "val11": null,
                  "val12": null,
                  "val13": "0",
                  "val14": "980",
                  "val15": null,
                  "val16": null,
                  "val17": null,
                  "val18": null,
                  "val19": null,
                  "val20": null,
                  "val21": null,
                  "val22": null,
                  "val23": null,
                  "val24": null,
                  "val25": null,
                  "val26": null,
                  "val27": null,
                  "val28": null,
                  "val29": null,
                  "val30": null,
                  "val31": null,
                  "val32": null,
                  "val33": null,
                  "val34": null,
                  "val35": null,
                  "val36": null,
                  "val37": null,
                  "val38": null,
                  "val39": null,
                  "val40": null,
                  "val41": null,
                  "val42": null,
                  "val43": null,
                  "val44": null,
                  "val45": null,
                  "val46": null,
                  "val47": null,
                  "val48": null,
                  "val49": null,
                  "val50": null,
                  "val51": null,
                  "val52": null,
                  "val53": null,
                  "val54": null,
                  "val55": null,
                  "val56": null,
                  "val57": null,
                  "val58": null,
                  "val59": null,
                  "val60": null,
                  "val61": null,
                  "val62": null,
                  "val63": null,
                  "val64": null,
                  "val65": null,
                  "val66": null,
                  "val67": null,
                  "val68": null,
                  "val69": null,
                  "val70": null,
                  "val71": null,
                  "val72": null,
                  "val73": null,
                  "val74": null,
                  "val75": null,
                  "val76": null,
                  "val77": null,
                  "val78": null,
                  "val79": null,
                  "val80": null,
                  "val81": null,
                  "val82": null,
                  "val83": null,
                  "val84": null,
                  "val85": null,
                  "val86": null,
                  "val87": null,
                  "val88": null,
                  "val89": null,
                  "val90": null,
                  "val91": null,
                  "val92": null,
                  "val93": null,
                  "val94": null,
                  "val95": null,
                  "val96": null,
                  "val97": null,
                  "val98": null,
                  "val99": null,
                  "val100": null,
                  "val101": null,
                  "val102": null,
                  "val103": null,
                  "val104": null,
                  "val105": null,
                  "val106": null,
                  "val107": null,
                  "val108": null,
                  "val109": null,
                  "val110": null,
                  "val111": null,
                  "val112": null,
                  "val113": null,
                  "val114": null,
                  "val115": null,
                  "val116": null,
                  "val117": null,
                  "val118": null,
                  "val119": null,
                  "val120": null
                },
                {
                  "id": 1182,
                  "inventoryNumber": null,
                  "goodId": "1182",
                  "description": "GRABADORA MARCA MECOA, COLOR ROJA AM, FM, CON UNA BOCINA",
                  "quantity": "1.000",
                  "dateIn": "2000-02-11T00:00:00.000Z",
                  "dateOut": null,
                  "expireDate": null,
                  "ubicationType": "A",
                  "status": "ADE",
                  "goodCategory": null,
                  "originSignals": null,
                  "registerInscrSol": null,
                  "dateOpinion": null,
                  "proficientOpinion": null,
                  "valuerOpinion": null,
                  "opinion": null,
                  "appraisedValue": "25.00",
                  "drawerNumber": null,
                  "vaultNumber": null,
                  "goodReferenceNumber": "1182",
                  "appraisalCurrencyKey": "MN",
                  "appraisalVigDate": null,
                  "legalDestApprove": null,
                  "legalDestApproveUsr": null,
                  "legalDestApproveDate": null,
                  "complianceLeaveDate": null,
                  "complianceNotifyDate": null,
                  "leaveObservations": null,
                  "judicialLeaveDate": null,
                  "notifyDate": null,
                  "notifyA": null,
                  "placeNotify": null,
                  "discardRevRecDate": null,
                  "resolutionEmissionRecRevDate": null,
                  "admissionAgreementDate": null,
                  "audienceRevRecDate": null,
                  "revRecObservations": null,
                  "leaveCause": null,
                  "resolution": null,
                  "fecUnaffordability": null,
                  "unaffordabilityJudgment": null,
                  "userApproveUse": null,
                  "useApproveDate": null,
                  "useObservations": null,
                  "dateRequestChangeNumerary": null,
                  "numberChangeRequestUser": null,
                  "causeNumberChange": null,
                  "changeRequestNumber": null,
                  "authNumberChangeDate": null,
                  "authChangeNumberUser": null,
                  "authChangeNumber": null,
                  "numberChangeRatifiesDate": null,
                  "numberChangeRatifiesUser": null,
                  "notifyRevRecDate": null,
                  "revRecCause": null,
                  "initialAgreement": null,
                  "observations": null,
                  "fileNumber": "789",
                  "associatedFileNumber": "798",
                  "rackNumber": "1",
                  "storeNumber": 321,
                  "lotNumber": "3",
                  "goodClassNumber": 62,
                  "subDelegationNumber": null,
                  "delegationNumber": null,
                  "physicalReceptionDate": "2012-11-15T00:00:00.000Z",
                  "statusResourceReview": null,
                  "judicialDate": null,
                  "abandonmentDueDate": null,
                  "destructionApproveDate": null,
                  "destructionApproveUser": null,
                  "observationDestruction": "DCB/395/2012. 08-10-2012",
                  "destinyNumber": null,
                  "registryNumber": "10716",
                  "agreementDate": null,
                  "state": null,
                  "opinionType": null,
                  "presentationDate": null,
                  "revRecRemedyDate": null,
                  "receptionStatus": null,
                  "promoterUserDecoDevo": null,
                  "scheduledDateDecoDev": null,
                  "goodsPartializationFatherNumber": null,
                  "seraAbnDeclaration": null,
                  "identifier": "ASEG",
                  "siabiInventoryId": null,
                  "cisiPropertyId": null,
                  "siabiInvalidId": null,
                  "tesofeDate": null,
                  "tesofeFolio": null,
                  "situation": null,
                  "labelNumber": "4",
                  "flyerNumber": "7069",
                  "insertRegDate": "2000-02-11T00:00:00.000Z",
                  "visportal": null,
                  "unit": "PIEZA",
                  "referenceValue": null,
                  "insertHcDate": null,
                  "extDomProcess": "ASEGURADO",
                  "requestId": null,
                  "goodTypeId": null,
                  "subTypeId": null,
                  "goodStatus": "EN_RECEPCION",
                  "idGoodProperty": null,
                  "requestFolio": null,
                  "type": null,
                  "admissionDate": null,
                  "locationId": null,
                  "uniqueKey": null,
                  "fileeNumber": null,
                  "goodDescription": null,
                  "physicalStatus": null,
                  "unitMeasure": null,
                  "ligieUnit": null,
                  "quantityy": null,
                  "destiny": null,
                  "appraisal": null,
                  "notesTransferringEntity": null,
                  "fractionId": null,
                  "federalEntity": null,
                  "stateConservation": null,
                  "armor": null,
                  "brand": null,
                  "subBrand": null,
                  "model": null,
                  "axesNumber": null,
                  "engineNumber": null,
                  "tuition": null,
                  "serie": null,
                  "chassis": null,
                  "cabin": null,
                  "volume": null,
                  "origin": null,
                  "useType": null,
                  "manufacturingYear": null,
                  "capacity": null,
                  "operationalState": null,
                  "enginesNumber": null,
                  "dgacRegistry": null,
                  "airplaneType": null,
                  "flag": null,
                  "openwork": null,
                  "length": null,
                  "sleeve": null,
                  "shipName": null,
                  "publicRegistry": null,
                  "ships": null,
                  "caratage": null,
                  "material": null,
                  "weight": null,
                  "satFile": null,
                  "satClassificationId": null,
                  "satSubclassificationId": null,
                  "satGuideMaster": null,
                  "satGuideHouse": null,
                  "satDepartureNumber": null,
                  "satAlmAddress": null,
                  "satAlmColony": null,
                  "satAlmCityPopulation": null,
                  "satAlmMunicipalityDelegation": null,
                  "satAlmFederativeEntity": null,
                  "satAddressDelivery": null,
                  "satBreaches": null,
                  "userCreation": null,
                  "creationDate": null,
                  "userModification": null,
                  "modificationDate": null,
                  "ligieSection": null,
                  "ligieChapter": null,
                  "ligieLevel1": null,
                  "ligieLevel2": null,
                  "ligieLevel3": null,
                  "ligieLevel4": null,
                  "satUniqueKey": null,
                  "unfair": null,
                  "platesNumber": null,
                  "clarification": null,
                  "reprogrammationNumber": null,
                  "reasonCancReprog": "1",
                  "storeId": null,
                  "instanceDate": null,
                  "processStatus": "REGISTRO_SOLICITUD",
                  "version": null,
                  "observationss": null,
                  "addressId": null,
                  "compliesNorm": null,
                  "descriptionGoodSae": null,
                  "quantitySae": "1",
                  "saeMeasureUnit": "A",
                  "saePhysicalState": "1",
                  "stateConservationSae": "1",
                  "programmationStatus": "EN_TRANSPORTABLE",
                  "executionStatus": "EN_RECEPCION",
                  "duplicity": null,
                  "duplicatedGood": null,
                  "compensation": null,
                  "validateGood": null,
                  "ebsStatus": null,
                  "concurrentNumber": null,
                  "concurrentMsg": null,
                  "fitCircular": null,
                  "theftReport": null,
                  "transferentDestiny": null,
                  "saeDestiny": "1",
                  "rejectionClarification": null,
                  "goodResdevId": null,
                  "indClarification": "N",
                  "msgSatSae": null,
                  "color": null,
                  "doorsNumber": null,
                  "destinationRedress": null,
                  "val1": "PIEZA",
                  "val2": "MECAO",
                  "val3": "S/M",
                  "val4": "S/M",
                  "val5": "S/N",
                  "val6": null,
                  "val7": "MALO",
                  "val8": null,
                  "val9": "REGULAR",
                  "val10": null,
                  "val11": null,
                  "val12": null,
                  "val13": null,
                  "val14": null,
                  "val15": null,
                  "val16": null,
                  "val17": null,
                  "val18": null,
                  "val19": null,
                  "val20": null,
                  "val21": null,
                  "val22": null,
                  "val23": null,
                  "val24": null,
                  "val25": null,
                  "val26": null,
                  "val27": null,
                  "val28": null,
                  "val29": null,
                  "val30": null,
                  "val31": null,
                  "val32": null,
                  "val33": null,
                  "val34": null,
                  "val35": null,
                  "val36": null,
                  "val37": null,
                  "val38": null,
                  "val39": null,
                  "val40": null,
                  "val41": null,
                  "val42": null,
                  "val43": null,
                  "val44": null,
                  "val45": null,
                  "val46": null,
                  "val47": null,
                  "val48": null,
                  "val49": null,
                  "val50": null,
                  "val51": null,
                  "val52": null,
                  "val53": null,
                  "val54": null,
                  "val55": null,
                  "val56": null,
                  "val57": null,
                  "val58": null,
                  "val59": null,
                  "val60": null,
                  "val61": null,
                  "val62": null,
                  "val63": null,
                  "val64": null,
                  "val65": null,
                  "val66": null,
                  "val67": null,
                  "val68": null,
                  "val69": null,
                  "val70": null,
                  "val71": null,
                  "val72": null,
                  "val73": null,
                  "val74": null,
                  "val75": null,
                  "val76": null,
                  "val77": null,
                  "val78": null,
                  "val79": null,
                  "val80": null,
                  "val81": null,
                  "val82": null,
                  "val83": null,
                  "val84": null,
                  "val85": null,
                  "val86": null,
                  "val87": null,
                  "val88": null,
                  "val89": null,
                  "val90": null,
                  "val91": null,
                  "val92": null,
                  "val93": null,
                  "val94": null,
                  "val95": null,
                  "val96": null,
                  "val97": null,
                  "val98": null,
                  "val99": null,
                  "val100": null,
                  "val101": null,
                  "val102": null,
                  "val103": null,
                  "val104": null,
                  "val105": null,
                  "val106": null,
                  "val107": null,
                  "val108": null,
                  "val109": null,
                  "val110": null,
                  "val111": null,
                  "val112": null,
                  "val113": null,
                  "val114": null,
                  "val115": null,
                  "val116": null,
                  "val117": null,
                  "val118": null,
                  "val119": null,
                  "val120": null
                }
              ];*/
              let goods = allGoods?.data;
              const polls = goods.map(async (good: any) => {
                let goodId = good.numGoodId.goodsID; //good.id
                console.log(goodId);
                let finalStatus = await this.getFinalStatus([goodId]);
                finalStatus = {
                  ...finalStatus,
                  good: good.numGoodId,
                };
                return finalStatus;
              });

              /*const polls =goods.map(async (good:any)=> {
                console.log(good)
                let finalStatus = await this.getFinalStatus([good]);
                finalStatus={
                  ...finalStatus,
                  good:good
                }
                return finalStatus
              });*/

              Promise.allSettled(polls)
                .then(data => {
                  console.log('promesas resueltas');
                  console.log(data);
                  data.map(async (resp: any) => {
                    if (
                      resp.status === 'fulfilled' &&
                      resp.value.data.length > 0
                    ) {
                      //TODO:UPDATE ESTATUS GOOD
                      let value = resp.value.data[0];
                      console.log(value);
                      let good = resp.value.good;
                      good.status = value.statusfinal;
                      console.log(good.status);
                      this.updateGoods(good)
                        .then(respUG => {
                          this.udpateHistoryGood(good.id, value.statusfinal)
                            .then(respUHG => respUG)
                            .catch(err => {
                              this.historyGoodFailed.push(good.id);
                              console.log(
                                `No se pudo actualizar el histórico para el bien ${good.id}`
                              );
                              console.log(err);
                            });
                        })
                        .catch(err => {
                          this.updateGoodFalied.push(good.id);
                          console.log(
                            `No se pudo actualizar el bien ${good.id}`
                          );
                          console.log(err);
                        });
                    } else {
                      //TODO: NOT POSSIBLE...
                      console.log('Estatus final no disponible');
                    }
                  });

                  const pollsGAM = goods.map(async (good: any) => {
                    console.log('POLLSGAM');
                    console.log(good);
                    let _good = good.numGoodId;
                    let goodId = _good.goodsID;
                    let clasif_numerario = 'N';
                    console.log(
                      this.di_clasif_numerario,
                      '--',
                      Number(_good.goodsClassId)
                    );
                    //this.di_clasif_numerario
                    Number(_good.goodsClassId) == this.di_clasif_numerario
                      ? (clasif_numerario = 'S')
                      : (clasif_numerario = 'N');
                    /*if(good.goodClassNumber == this.di_clasif_numerario){
                      console.log('SI ES NUMERARIO')
                      clasif_numerario = 'S';
                    }else{
                      console.log('NO ES NUMERARIO')
                      clasif_numerario = 'N';
                    }*/
                    //console.log(goodId)

                    let isConcilied = await this.getAccountMovements(goodId);
                    _good.isNumerary = clasif_numerario;
                    isConcilied = {
                      ...isConcilied,
                      good: _good,
                    };

                    return isConcilied;
                  });

                  Promise.allSettled(pollsGAM).then(dataGAM => {
                    console.log('promesas GAM CUMPLIDAS');
                    console.log(dataGAM);
                    dataGAM.map(async (resp: any) => {
                      if (resp.status === 'fulfilled' && resp.value.count > 0) {
                        let goodGAM = resp.value.good;
                        goodGAM = {
                          ...goodGAM,
                          isConcilied: 'S',
                        };
                        console.log('BIEN:', Number(goodGAM.goodsID));
                        console.log('ES CONCILIADO:', goodGAM.isConcilied);
                        console.log('ES NUMERARIO:', goodGAM.isNumerary);
                        if (
                          goodGAM.isConcilied == 'S' &&
                          goodGAM.isNumerary == 'S'
                        ) {
                          //TODO: CAMBIA CATEGORIA
                          this.updateAccountMovements(Number(goodGAM.goodsID))
                            .then(data => {
                              console.log(
                                'Categoria actualizada correctamente'
                              );
                              // this.onLoadToast(
                              //   'success',
                              //   'Categoría Actualizada',
                              //   ''
                              // );
                            })
                            .catch(err => {
                              console.log(err);
                            });
                        }
                      }
                    });
                  });
                })
                .catch(err => console.log(err));
              console.log('\n\nFinal');
              if (proceedingUpdated) {
                this.onLoadToast(
                  'success',
                  'Acta actualizada',
                  'El acta ha sido actualizada exitosamente'
                );
                let paginatedProceedings: any;
                let paginatedGoods: any;
                this.paramsProceedings.subscribe(data => {
                  console.log(`Paginado Actas: ${data}`);
                  paginatedProceedings = data;
                });
                this.paramsGoods.subscribe(data => {
                  console.log(`Paginado Bienes: ${data}`);
                  paginatedGoods = data;
                });
                this.reloadPage(
                  this.fileNumber,
                  paginatedProceedings,
                  paginatedGoods
                );
              }
            } else {
              this.onLoadToast(
                'error',
                'Error',
                'Existen bienes sin conciliar'
              );
            }
          } else {
            this.onLoadToast('error', 'Error', 'El valor del folio es vacío');
          }
        } else {
          this.onLoadToast(
            'error',
            'Error',
            'El plazo para cerrar actas del mes anterior ha terminado'
          );
        }
      } else {
        this.onLoadToast(
          'error',
          'Error',
          'Para cerrar un acta debe contener al menos un bien, favor de registrar este en pantalla de actas'
        );
      }
    } catch (error: any) {
      console.log('Catch Final');
    }
  }

  verifyError(error: any, defaultMsg: string) {
    console.log(error);
    let message: string = '';
    if (error?.status == 400) {
      message = defaultMsg;
    } else {
      message = error.message;
    }
    this.onLoadToast('error', 'Error', message);
    return message;
  }

  getFinalStatus(goodArray: number[]) {
    console.log('GET FINAL STATUS');
    this.showHideErrorInterceptorService.showHideError(false);
    return firstValueFrom(
      this.screenStatusService.getStatus({
        screen: 'FACTREFACTACIEDEV',
        goodArray,
        action: 'DEVOLUCION',
      })
    );
  }

  updateGoods(good: IGood) {
    this.showHideErrorInterceptorService.showHideError(false);
    return firstValueFrom(this.goodService.updateWithoutId(good));
  }

  udpateHistoryGood(goodNumber: number, status: string) {
    let data: IHistoryGood = {
      propertyNum: goodNumber,
      status: status,
      changeDate: new Date(),
      userChange: this.userInfo,
      reasonForChange: 'Automatico',
      statusChangeProgram: 'FACTREFACTACIEDEV',
    };
    this.showHideErrorInterceptorService.showHideError(false);
    return firstValueFrom(this.historyGood.create(data));
  }

  getTotalReconciledGoods(proceedingNumb: string | number) {
    this.showHideErrorInterceptorService.showHideError(false);
    return firstValueFrom(
      this.detailProceedingsDevolutionService.getTotalReconciledGoods(
        proceedingNumb
      )
    );
  }

  searchUnreconciledGoods(reconciledGoods: any, totalGoods: any) {
    console.debug(reconciledGoods);
    console.debug(totalGoods);
    let goodsWithoutReconciling: any[] = [];
    for (let good of totalGoods) {
      let flag = false;
      for (let reconciledGood of reconciledGoods) {
        if (good == reconciledGood?.goodsNumber?.id) flag = true;
      }
      if (!flag) {
        goodsWithoutReconciling.push(good);
      }
    }
    return reconciledGoods;
  }

  getMaximunClosingTime() {
    return firstValueFrom(
      this.maximunClosingTimeService.getByProceedingsType('DEV')
    );
  }

  getScannedDocument() {
    console.log('getScannedDocument');
    this.showHideErrorInterceptorService.showHideError(false);
    return firstValueFrom(
      this.documentService.getByFilters({
        id: this.dataProceedingsSelected.universalFolio,
        scanStatus: 'ESCANEADO',
        numberProceedings: 2156753,
      })
    );
  }

  getAllGoods() {
    console.log('getAllGoods');
    return firstValueFrom(
      this.detailProceedingsDevolutionService.getDetailProceedingsDevolutionByProceedingsNumb(
        this.proceedingsNumb,
        { limit: this.quantityOfGoods }
      )
    );
  }

  getAccountMovements(goodId: number) {
    this.filterParams.getValue().removeAllFilters();
    this.filterParams.getValue().page = 1;

    this.filterParams
      .getValue()
      .addFilter('numberGood', goodId, SearchFilter.EQ);
    return firstValueFrom(
      this.accountMovements.getAll(this.filterParams.getValue().getParams())
    );
  }

  updateAccountMovements(goodId: number) {
    this.showHideErrorInterceptorService.showHideError(false);
    return firstValueFrom(
      this.accountMovements.updateAccountMovements(goodId, 'DEVOLUCION')
    );
  }

  extractNumberOfGoods(goods: any) {
    console.log('extractNumberOfGoods');
    console.log(goods);
    let arrayGoods: any[] = [];
    for (let good of goods) {
      console.log(good);
      arrayGoods.push(good.goodNumber?.goodsID);
    }
    return arrayGoods;
  }

  validateClosingDate(maximunClosingTime: Date) {
    let validDate: boolean = false;
    let currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - 3); //restando un mes a la fecha actual
    console.log(currentDate);
    //se obtiene el último día del mes
    let lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    console.log(lastDayOfMonth.getDate());
    currentDate.setDate(currentDate.getDate() + lastDayOfMonth.getDate());
    console.log(currentDate);
    // let testDate = new Date('2008-06-1');
    console.log(maximunClosingTime);
    if (currentDate < new Date(maximunClosingTime)) {
      //cambiar testDate x currentDate
      validDate = true;
    }
    console.log(validDate);
    return validDate;
  }

  //se construye el objeto necesario para actualizar el acta
  buildObjectToUpdate(status: string) {
    console.log(this.dataResp);
    let dataToUpdate: any = {};
    for (let key in this.dataResp) {
      if (key == 'transferNumber') {
        dataToUpdate[key] = this.dataResp[key].id;
      } else {
        if (key == 'fileNumber') {
          dataToUpdate[key] = this.dataResp[key].filesId;
        } else {
          if (key != 'delegationNumber')
            dataToUpdate[key] = this.dataResp[key as keyof IProceedings];
        }
      }
    }
    dataToUpdate.proceedingStatus = status;
    return dataToUpdate;
  }

  updateProceeding(dataToUpdate: any) {
    console.log('update...');
    return firstValueFrom(
      this.proceedingsService.update(dataToUpdate.id, dataToUpdate)
    );
  }

  copyFormValues(dataToUpdate: IUpdateProceedings, data: any) {
    for (let property in data) {
      dataToUpdate ? [property] : data[property];
    }
    console.log(dataToUpdate);
  }

  prepareForm() {
    this.form = this.fb.group({
      previewFind: [null],
      penaltyCause: [null, []],
    });
  }

  getScreenName() {
    this.screenName = this.activatedRoute.snapshot.data['screen'];
    console.log(this.screenName);
  }
}
