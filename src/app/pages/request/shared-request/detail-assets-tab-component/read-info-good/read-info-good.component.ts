import {
  Component,
  inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { ModelForm } from 'src/app/core/interfaces/model-form';
import { AuthService } from 'src/app/core/services/authentication/auth.service';
import { FractionService } from 'src/app/core/services/catalogs/fraction.service';
import { GenericService } from 'src/app/core/services/catalogs/generic.service';
import { TypeRelevantService } from 'src/app/core/services/catalogs/type-relevant.service';
import { GoodsQueryService } from 'src/app/core/services/goodsquery/goods-query.service';
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
  goodData: any = {};
  relevantTypeName: string = 'buscar';
  goodForm: ModelForm<any>;
  destiniSaeSelected = new DefaultSelect();
  selectPhysicalState = new DefaultSelect();
  selectConcervationState = new DefaultSelect();
  selectMeasureUnitSae = new DefaultSelect();

  duplicity: string = '';
  avaluo: string = '';
  cumplyNorma: string = '';
  destinyLigie: string = '';
  goodType: string = '';
  transferentDestiny: string = '';
  physicalStatus: string = '';
  conservationState: string = '';
  destinySAE: string = '';
  unitMeasureLigie: string = '';
  unitMeasureTransferent: string = '';
  showButton = true;

  private readonly fractionsService = inject(FractionService);
  private readonly genericService = inject(GenericService);
  private readonly goodService = inject(GoodService);
  private readonly authService = inject(AuthService);
  private readonly goodsQueryService = inject(GoodsQueryService);
  private readonly typeRelevantSevice = inject(TypeRelevantService);

  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('proceso', this.process);
    //console.log('type of request', this.typeOfRequest);
    this.goodData = this.detailAssets.value;
    if (this.goodData) {
      this.getTypeGood();

      this.getPhysicalState(new ListParams(), this.goodData.physicalStatus);
      //this.getConcervationState(new ListParams());
      this.getDuplicity();
      this.getAvaluo();
      this.achiveNorma();
      this.getDestiny(this.goodData.destiny); // no se usa en verificar cumpli
      this.getGoodType();

      if (
        this.typeOfRequest == 'PGR_SAE' &&
        this.process == 'classify-assets'
      ) {
        this.getUnitMeasureSae(new ListParams());
        this.getConcervationState(new ListParams());
        //destino sae
        this.getDestinoSAE(new ListParams(), this.goodData.saeDestiny);
      }

      if (
        this.typeOfRequest == 'PGR_SAE' &&
        this.process == 'verify-compliance'
      ) {
        this.getDestinyTransferent(this.goodData.transferentDestiny);
        this.getConcervationState(
          new ListParams(),
          this.goodData.stateConservation
        );
        this.getDestinoSAE(new ListParams());
      }

      if (
        this.typeOfRequest == 'MANUAL' &&
        this.process == 'verify-compliance'
      ) {
        this.getConcervationState(
          new ListParams(),
          this.goodData.stateConservation
        );
      }
    }
  }

  ngOnInit(): void {
    this.goodForm = this.fb.group({
      saeDestiny: [null],
      physicalStatus: [null],
      stateConservation: [null],
      saeMeasureUnit: [null],
    });
  }

  getTypeGood() {
    const params = new ListParams();
    params['filter.id'] = `$eq:${this.goodData.fractionId}`;
    this.fractionsService.getAll(params).subscribe({
      next: resp => {
        this.relevantTypeName = resp.data[0].description;
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getDestinoSAE(params: ListParams, id?: string | number) {
    params['filter.name'] = '$eq:Destino';
    if (id) {
      params['filter.keyId'] = `$eq:${id}`;
    }
    this.genericService.getAll(params).subscribe({
      next: resp => {
        if (
          this.typeOfRequest == 'PGR_SAE' &&
          this.process == 'verify-compliance'
        ) {
          this.destinySAE = resp.data[0].description;
        } else {
          this.destiniSaeSelected = new DefaultSelect(resp.data, resp.count);
        }
      },
      error: error => {
        console.log('destinoSae ', error);
      },
    });
  }

  getPhysicalState(params: ListParams, id?: string) {
    params['filter.name'] = '$eq:Estado Fisico';
    if (id) {
      params['filter.keyId'] = `$eq:${id}`;
    }
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          console.log('estado fisico', data.data);
          if (
            (this.typeOfRequest == 'MANUAL' ||
              this.typeOfRequest == 'PGR_SAE') &&
            this.process == 'verify-compliance'
          ) {
            this.physicalStatus = data.data[0].description;
          } else {
            this.selectPhysicalState = new DefaultSelect(data.data, data.count);
            this.goodForm.controls['physicalStatus'].setValue(
              this.goodData.physicalStatus
            );
          }
        },
      });
  }

  getConcervationState(params: ListParams, id?: string | number) {
    params['filter.name'] = '$eq:Estado Conservacion';
    if (id) {
      params['filter.keyId'] = `$eq:${id}`;
    }
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: (data: any) => {
          if (
            (this.typeOfRequest == 'MANUAL' ||
              this.typeOfRequest == 'PGR_SAE') &&
            this.process == 'verify-compliance'
          ) {
            this.conservationState = data.data[0].description;
          } else {
            this.selectConcervationState = new DefaultSelect(
              data.data,
              data.count
            );

            this.goodForm.controls['stateConservation'].setValue(
              this.goodData.stateConservation
            );
          }
        },
      });
  }

  //trae datos para verificar cumplimiento

  getDestinyTransferent(id: string | number) {
    let params = new ListParams();
    params['filter.name'] = '$eq:Destino';
    params['filter.keyId'] = `$eq:${id}`;
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: ({ data }: any) => {
          if (
            this.typeOfRequest == 'PGR_SAE' &&
            this.process == 'verify-compliance'
          ) {
            this.transferentDestiny = data[0].description;
          }
        },
      });
  }

  getDestiny(id: string | number) {
    if (this.goodData.destiny) {
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
  }

  getUnitMeasureSae(params: ListParams, id?: string | number) {
    this.goodsQueryService
      .getCatMeasureUnitView(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: resp => {
          if (
            (this.typeOfRequest == 'MANUAL' ||
              this.typeOfRequest == 'PGR_SAE') &&
            this.process == 'verify-compliance'
          ) {
            this.unitMeasureLigie = resp.data[0].municipality;
          } else {
            this.selectMeasureUnitSae = new DefaultSelect(
              resp.data,
              resp.count
            );
          }
        },
      });
  }

  getGoodType() {
    if (!this.goodData.goodTypeId) {
      return;
    }
    const id = this.goodData.goodTypeId;
    this.typeRelevantSevice.getById(id).subscribe({
      next: (data: any) => {
        this.goodType = data.description;
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

  save() {
    Swal.fire({
      title: 'Actualizando',
      text: '¿Esta seguro de querer actualizar la información del bien?',
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
        console.log(good);

        this.goodService.update(good).subscribe({
          next: resp => {
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
              `El formulario no se puedo actualizar ${error.error.message}`
            );
          },
        });
      }
    });
  }
}
