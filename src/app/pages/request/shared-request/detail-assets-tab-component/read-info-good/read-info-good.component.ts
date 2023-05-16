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
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
import { GoodFinderService } from 'src/app/core/services/ms-good/good-finder.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
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
  destiniSaeSelected = new DefaultSelect();
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

  private readonly fractionsService = inject(FractionService);
  private readonly genericService = inject(GenericService);
  private readonly goodService = inject(GoodService);
  private readonly authService = inject(AuthService);
  private readonly goodsQueryService = inject(GoodsQueryService);
  private readonly typeRelevantSevice = inject(TypeRelevantService);
  private readonly goodFinderService = inject(GoodFinderService);

  constructor(
    private fb: FormBuilder,
    private fractionService: FractionsService
  ) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.formLoading = true;
    this.goodData = this.detailAssets.value;
    console.log('bien', this.goodData);
    if (this.goodData) {
      this.getGood(this.goodData.id);

      this.getConcervationState(
        new ListParams(),
        this.goodData.stateConservation
      );
      this.getUnitMeasureSae(new ListParams(), this.goodData.saeMeasureUnit);
      this.getPhysicalState(new ListParams(), this.goodData.physicalStatus);
      this.getDestinoSAE(new ListParams(), this.goodData.saeDestiny);
      this.getTypeGood();

      this.getDuplicity();
      this.getAvaluo();
      this.achiveNorma();
    }
    setTimeout(() => {
      this.formLoading = false;
    }, 4000);
  }

  descriptionGoodSae: string = '';
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
        const good = resp.data[0];
        this.goodType = good.descriptionRelevantType
          ? good.descriptionRelevantType
          : '';
        this.relevantTypeName = good.typeDescriptionSiabClassification
          ? good.typeDescriptionSiabClassification
          : '';
        this.physicalStatus = good.descriptionGenerics
          ? good.descriptionGenerics
          : '';
        this.unitMeasureLigie = await this.getUnitMeasureLigie(
          new ListParams(),
          this.goodData.ligieUnit
        );
        this.transferentDestiny = await this.getDestinyTransferent(
          this.goodData.transferentDestiny
        );
        this.unitMeasureTransferent = good.measureTlUnitView
          ? good.measureTlUnitView
          : '';
        this.fraction = good.fractionCodeFracction;
      },
    });
  }

  getDestinoSAE(params: ListParams, id?: string | number) {
    params['filter.name'] = '$eq:Destino';
    if (id && this.process != 'classify-assets') {
      params['filter.keyId'] = `$eq:${id}`;
    }
    this.genericService.getAll(params).subscribe({
      next: resp => {
        if (this.process == 'classify-assets') {
          if (id) {
            this.destiniSaeSelected = new DefaultSelect(resp.data, resp.count);
            this.goodForm.controls['saeDestiny'].setValue(id);
          } else {
            this.destiniSaeSelected = new DefaultSelect(resp.data, resp.count);
          }
        }
        this.destinySAE = resp.data[0].description;
      },
      error: error => {
        console.log('destinoSae ', error);
      },
    });
  }

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
          this.physicalStatus = data.data[0].description;
        },
      });
  }

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

          this.conservationState = data.data[0].description;
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

  getDestinyTransferent(id: string | number) {
    return new Promise((resolve, reject) => {
      let params = new ListParams();
      params['filter.name'] = '$eq:Destino';
      params['filter.keyId'] = `$eq:${id}`;
      this.genericService
        .getAll(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: ({ data }: any) => {
            resolve(data[0].description.toString());
          },
          error: error => {
            resolve('');
          },
        });
    });
  }

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
          this.saeMeasureUnit = id ? resp.data[0].measureTlUnit : '';
        },
      });
  }

  getUnitMeasureLigie(params: ListParams, id?: string) {
    return new Promise((resolve, reject) => {
      params['filter.uomCode'] = `$eq:${id}`;
      this.goodsQueryService
        .getCatMeasureUnitView(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: resp => {
            resolve(resp.data[0].measureTlUnit.toString());
          },
          error: error => {
            resolve('');
          },
        });
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
    this.dataToSend.saeMeasureUnit = event.uomCode;
  }

  destinySae(event: any) {
    this.dataToSend.saeDestiny = event.keyId;
  }

  physicalState(event: any) {
    this.dataToSend.physicalStatus = event.keyId;
    this.dataToSend.physicstateName = event.description;
  }

  concervationState(event: any) {
    this.dataToSend.stateConservation = event.keyId;
    this.dataToSend.stateConservationName = event.description;
  }

  save() {
    Swal.fire({
      title: 'Actualizando',
      text: '¿Está seguro que desea actualizar la información del bien?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#9d2449',
      cancelButtonColor: '#a78457',
      confirmButtonText: 'Aceptar',
    }).then(result => {
      if (result.isConfirmed) {
        const user: any = this.authService.decodeToken();
        const good = this.goodForm.getRawValue();
        good.id = this.goodData.id;
        good.goodId = this.goodData.goodId;
        good.userModification = user.username;
        good.modificationDate = new Date().toISOString();

        this.goodService.update(good).subscribe({
          next: resp => {
            const body: any = {};
            body.id = resp.id;
            body.saeDestiny = resp.saeDestiny;
            body.physicalStatus = resp.physicalStatus;
            body.stateConservation = resp.stateConservation;
            body.saeMeasureUnit = resp.saeMeasureUnit;

            this.dataToSend.id = resp.id;
            this.saveDetailInfo.emit(this.dataToSend);
            this.onLoadToast(
              'success',
              'Actualizado',
              'Formulario actualizado'
            );
          },
          error: error => {
            this.onLoadToast(
              'error',
              'Error',
              `El formulario no se puede actualizar ${error.error.message}`
            );
          },
        });
      }
    });
  }
}
