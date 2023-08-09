import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs';
import {
  FilterParams,
  ListParams,
} from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { RequestService } from 'src/app/core/services/requests/request.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-read-info-good',
  templateUrl: './read-info-good.component.html',
  styleUrls: ['./read-info-good.component.scss'],
})
export class ReadInfoGoodComponent
  extends BasePage
  implements OnInit, OnChanges
{
  @Input() detailAssets: any;
  @Input() process: string = '';
  @Input() typeOfRequest: string = '';
  @Output() saveDetailInfo: EventEmitter<any> = new EventEmitter();
  goodData: any;
  relevantTypeName: string = '';
  goodForm: ModelForm<any>;
  destiniSaeSelected = new DefaultSelect<any>();
  selectPhysicalState = new DefaultSelect();
  selectConcervationState = new DefaultSelect();
  selectMeasureUnitSae = new DefaultSelect();
  formLoading: boolean = false;

  duplicity: string = '';
  avaluo: string = '';
  cumplyNorma: string = '';
  destinyLigie: string = '';
  goodType: string = '';
  transferentDestiny: any = '';
  physicalStatus: string = '';
  conservationState: string = '';
  destinySAE: string = '';
  unitMeasureLigie: any = '';
  fraction: string = '';
  unitMeasureTransferent: any = '';
  saeMeasureUnit: string = '';
  dataToSend: any = {};
  showButton = true;
  subType: string;
  norm: string;
  uniqueKey: string;
  idSolicitud: Number = 0;
  descriptionGoodSae: string = '';

  private readonly fractionsService = inject(FractionService);
  private readonly genericService = inject(GenericService);
  private readonly goodService = inject(GoodService);
  private readonly authService = inject(AuthService);
  private readonly goodsQueryService = inject(GoodsQueryService);
  private readonly typeRelevantSevice = inject(TypeRelevantService);
  private readonly goodFinderService = inject(GoodFinderService);
  private readonly requestService = inject(RequestService);

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formLoading = true;
    this.goodData = this.detailAssets.value;
    console.log('bien', this.goodData);
    if (this.goodData) {
      this.getGood(this.goodData.id);
      this.getDestiny(this.goodData.destiny);
      this.getTransferentUnit(this.goodData.unitMeasure);

      if (this.process == 'classify-assets') {
        this.getUnitMeasureSae(new ListParams(), this.goodData.saeMeasureUnit);
        this.getDestinoSAE(
          new ListParams(),
          this.goodData.saeDestiny,
          this.goodData.requestId
        );
        this.getConcervationState(
          new ListParams(),
          this.goodData.stateConservation
        );
        this.getPhysicalState(new ListParams(), this.goodData.physicalStatus);
      }

      this.getTypeGood();

      this.getDuplicity();
      this.getAvaluo();
      this.achiveNorma();
    }
    setTimeout(() => {
      this.formLoading = false;
    }, 4000);
  }

  getDescriptionGoodIndep(id: number | string) {
    this.goodService.getByIdAndGoodId(id, id).subscribe({
      next: response => {
        console.log('Data del good', response);
        console.log(
          'Descripción del bien INDEP es: ',
          response.descriptionGoodSae
        );
        this.descriptionGoodSae = response.descriptionGoodSae;
      },
      error: error => {
        console.log('no se buscó');
      },
    });
  }

  ngOnInit(): void {
    this.goodForm = this.fb.group({
      saeDestiny: [null],
      physicalStatus: [null],
      stateConservation: [null],
      saeMeasureUnit: [null],
    });
  }

  getGood(goodId: number) {
    let params = new FilterParams();
    params.addFilter('id', goodId);
    const filter = params.getParams();
    this.goodFinderService.goodFinder(filter).subscribe({
      next: async resp => {
        this.idSolicitud = resp.data[0].requestId;
        console.log('id de solicitd', this.idSolicitud);

        console.log('getGood', resp.data[0]);
        const good = resp.data[0];
        console.log('Fracción', good.fractionCodeFracction);
        this.goodType = good.descriptionRelevantType
          ? good.descriptionRelevantType
          : '';
        this.relevantTypeName = good.typeDescriptionSiabClassification
          ? good.typeDescriptionSiabClassification
          : '';
        this.physicalStatus = good.descriptionPhysicalStatus
          ? good.descriptionPhysicalStatus
          : '';
        this.destinySAE = good.descriptionDestinySae
          ? good.descriptionDestinySae
          : '';

        this.unitMeasureLigie = good.measureUnitLigie
          ? good.measureUnitLigie
          : '';

        this.transferentDestiny = good.descriptionDestinyTransferent
          ? good.descriptionDestinyTransferent
          : '';

        this.conservationState = good.descriptionConservationStatus
          ? good.descriptionConservationStatus
          : '';

        this.saeMeasureUnit = good.measureUnitSae ? good.measureUnitSae : '';

        this.fraction = good.fractionCodeFracction;
        this.uniqueKey = good.uniqueKey ? good.uniqueKey : '';
      },
      error: error => {
        console.log(error);
      },
    });
  }
  //destiniSaeSelected = new DefaultSelect<any>();
  //ver
  typeTransferent: string = '';
  getDestinoSAE(
    params: ListParams,
    id?: string | number,
    idSolicitud?: string | number
  ) {
    console.log('id de solicitd en select', idSolicitud);

    params['filter.name'] = '$eq:Destino';
    if (id && this.process != 'classify-assets') {
      params['filter.keyId'] = `$eq:${id}`;
    }
    this.genericService.getAll(params).subscribe({
      next: resp => {
        this.destiniSaeSelected = new DefaultSelect(resp.data, resp.count);

        //OBTENER TIPO DE SOLICITUD
        this.requestService.getById(idSolicitud).subscribe({
          next: res => {
            const transferente = res.typeOfTransfer;
            console.log(
              'info de la solicitud',
              res,
              'Transferente, ',
              res.typeOfTransfer
            );

            switch (transferente) {
              case 'SAT_SAE':
                console.log('SAT_SAE');

                if (this.goodForm.controls['saeDestiny'].value === null) {
                  this.goodForm.controls['saeDestiny'].setValue('1');
                } else {
                  const destinyTransf =
                    this.goodForm.controls['saeDestiny'].value;
                  this.goodForm.controls['saeDestiny'].setValue(destinyTransf);
                }

                break;
              case 'PGR_SAE':
                console.log('PGR_SAE');

                if (this.goodForm.controls['saeDestiny'].value === null) {
                  this.goodForm.controls['saeDestiny'].setValue('4');
                } else {
                  const destinyTransf =
                    this.goodForm.controls['saeDestiny'].value;
                  this.goodForm.controls['saeDestiny'].setValue(destinyTransf);
                }

                break;
              case 'MANUAL':
                console.log('MANUAL');

                if (this.goodForm.controls['saeDestiny'].value === null) {
                  this.goodForm.controls['saeDestiny'].setValue('4');
                } else {
                  const destinyTransf =
                    this.goodForm.controls['saeDestiny'].value;
                  this.goodForm.controls['saeDestiny'].setValue(destinyTransf);
                }

                break;
            }
          },
          error: error => {
            this.typeTransferent = '';
            console.log(
              'Error al consultar solicitud',
              error,
              'Transferente, ',
              this.typeTransferent
            );
          },
        });

        // if (this.process == 'classify-assets') {
        //   if (id) {
        //     this.destiniSaeSelected = new DefaultSelect(resp.data, resp.count);
        //     this.goodForm.controls['saeDestiny'].setValue(id);
        //   } else {
        //     this.destiniSaeSelected = new DefaultSelect(resp.data, resp.count);
        //   }
        // }
        //this.destinySAE = resp.data[0].description;
      },
      error: error => {
        console.log('destinoSae ', error);
      },
    });
  }

  //ver
  getPhysicalState(params: ListParams, id?: string) {
    params['filter.name'] = '$eq:Estado Fisico';
    if (id && this.process != 'classify-assets') {
      params['filter.keyId'] = `$eq:${id}`;
    }
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          if (this.process == 'classify-assets') {
            if (id) {
              this.selectPhysicalState = new DefaultSelect(
                data.data,
                data.count
              );
              this.goodForm.controls['physicalStatus'].setValue(id);
            } else {
              this.selectPhysicalState = new DefaultSelect(
                data.data,
                data.count
              );
            }
          }
          //this.physicalStatus = data.data[0].description;
        },
      });
  }

  //ver
  getConcervationState(params: ListParams, id?: string | number) {
    params['filter.name'] = '$eq:Estado Conservacion';

    if (id && this.process != 'classify-assets') {
      params['filter.keyId'] = `$eq:${id}`;
    }
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          if (this.process == 'classify-assets') {
            if (id) {
              this.selectConcervationState = new DefaultSelect(
                data.data,
                data.count
              );
              this.goodForm.controls['stateConservation'].setValue(
                this.goodData.stateConservation
              );
            } else {
              this.selectConcervationState = new DefaultSelect(
                data.data,
                data.count
              );
            }
          }

          //this.conservationState = data.data[0].description;
        },
      });
  }

  getTypeGood() {
    const params = new ListParams();
    params['filter.id'] = `$eq:${this.goodData.fractionId}`;
    this.fractionsService.getAll(params).subscribe({
      next: (resp: any) => {
        if (resp.data[0].norms) {
          this.norm = resp.data[0].norms.id + ' ' + resp.data[0].norms.norm;
        } else {
          this.norm = '';
        }
      },
      error: error => {
        console.log(error);
      },
    });
  }

  //ver
  getUnitMeasureSae(params: ListParams, id?: string | number) {
    if (id && this.process != 'classify-assets') {
      params['filter.uomCode'] = `$eq:${id}`;
    }
    this.goodsQueryService
      .getCatMeasureUnitView(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          if (this.process == 'classify-assets') {
            if (id) {
              this.selectMeasureUnitSae = new DefaultSelect(
                resp.data,
                resp.count
              );
              this.goodForm.controls['saeMeasureUnit'].setValue(id);
            } else {
              this.selectMeasureUnitSae = new DefaultSelect(
                resp.data,
                resp.count
              );
            }
          }
          //this.saeMeasureUnit = id ? resp.data[0].measureTlUnit : '';
        },
      });
  }

  getTransferentUnit(id: string) {
    if (id == null) {
      this.unitMeasureTransferent = '';
      return;
    }
    const params = new ListParams();
    params['filter.uomCode'] = `$eq:${id}`;
    this.goodsQueryService
      .getCatMeasureUnitView(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          this.unitMeasureTransferent = resp.data[0].measureTlUnit;
        },
        error: error => {
          console.log(error);
        },
      });
  }

  getDestiny(id: number | string) {
    if (id == null) {
      this.destinyLigie = '';
      return;
    }
    let params = new ListParams();
    params['filter.name'] = '$eq:Destino';
    params['filter.keyId'] = `$eq:${id}`;
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: ({ data }: any) => {
          this.destinyLigie = data[0].description;
        },
      });
  }

  getAvaluo() {
    this.avaluo = this.goodData.appraisal === 'Y' ? 'Si' : 'No';
  }

  getDuplicity() {
    this.duplicity = this.goodData.duplicity === 'Y' ? 'Si' : 'No';
  }

  achiveNorma() {
    this.cumplyNorma = this.goodData.compliesNorm === 'Y' ? 'Si' : 'No';
  }

  unidMediIndep(event: any) {
    this.dataToSend.saeMeasureUnit = event != undefined ? event.uomCode : null;
  }

  destinySae(event: any) {
    this.dataToSend.saeDestiny = event != undefined ? event.keyId : null;
  }

  physicalState(event: any) {
    this.dataToSend.physicalStatus = event != undefined ? event.keyId : null;
    this.dataToSend.physicstateName =
      event != undefined ? event.description : null;
  }

  concervationState(event: any) {
    this.dataToSend.stateConservation = event != undefined ? event.keyId : null;
    this.dataToSend.stateConservationName =
      event != undefined ? event.description : null;
  }

  save() {
    Swal.fire({
      title: '¿Está seguro que desea actualizar la información del Bien?',
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#9d2449',
      cancelButtonColor: '#a78457',
      confirmButtonText: 'Aceptar',
      allowOutsideClick: false,
    }).then(result => {
      if (result.isConfirmed) {
        const user: any = this.authService.decodeToken();
        const good = this.goodForm.getRawValue();
        good.id = this.goodData.id;
        good.goodId = this.goodData.goodId;
        good.userModification = user.username;
        good.modificationDate = new Date().toISOString();
        //debugger;
        this.goodService.update(good).subscribe({
          next: resp => {
            const body: any = {};
            body.id = resp.id;
            body.saeDestiny = resp.saeDestiny ? resp.saeDestiny : null;
            body.physicalStatus = resp.physicalStatus
              ? resp.physicalStatus
              : null;
            body.stateConservation = resp.stateConservation
              ? resp.stateConservation
              : null;
            body.saeMeasureUnit = resp.saeMeasureUnit
              ? resp.saeMeasureUnit
              : null;

            this.dataToSend.id = resp.id;
            this.saveDetailInfo.emit(this.dataToSend);
            this.onLoadToast('success', 'Formulario actualizado', '');
          },
          error: error => {
            console.log(
              'El formulario no se puede actualizar',
              error.error.message
            );
            // this.onLoadToast(
            //   'error',
            //   'Error',
            //   `El formulario no se puede actualizar ${error.error.message}`
            // );
          },
        });
      }
    });
  }
}
