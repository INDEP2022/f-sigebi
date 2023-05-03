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
import { FractionsService } from 'src/app/core/services/catalogs/fractions.service';
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
  subType: string;
  goodForm: ModelForm<any>;
  destiniSaeSelected = new DefaultSelect();
  selectPhysicalState = new DefaultSelect();
  selectConcervationState = new DefaultSelect();
  selectMeasureUnitSae = new DefaultSelect();
  selectDestiny = new DefaultSelect();
  selectDestinyLigie = new DefaultSelect();
  ligie: string;
  duplicity: string = '';
  avaluo: string = '';
  cumplyNorma: string = '';
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
  private readonly fractionService = inject(FractionsService);
  constructor(private fb: FormBuilder) {
    super();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log('proceso', this.process);
    //console.log('type of request', this.typeOfRequest);
    this.goodData = this.detailAssets.value;
    // console.log('bien', this.goodData);
    if (this.goodData) {
      this.getTypeGood();

      this.getPhysicalState(new ListParams(), this.goodData.physicalStatus);
      //this.getConcervationState(new ListParams());
      this.getDuplicity();
      this.getAvaluo();
      this.achiveNorma();
      this.getDestiny(this.goodData.destiny); // no se usa en verificar cumpli
      this.getGoodType();
      this.getUnitMeasureSae(new ListParams());
      this.getConcervationState(new ListParams());
      //destino sae
      this.getDestinoSAE(new ListParams(), this.goodData.saeDestiny);
    }
  }

  ngOnInit(): void {
    this.goodForm = this.fb.group({
      saeDestiny: [null],
      physicalStatus: [null],
      stateConservation: [null],
      saeMeasureUnit: [null],
      ligieUnit: [null],
    });
  }

  getTypeGood() {
    const params = new ListParams();
    params['filter.id'] = `$eq:${this.goodData.fractionId}`;
    this.fractionsService.getAll(params).subscribe({
      next: resp => {
        this.relevantTypeName = resp.data[0].description;
        this.getSubTypeGood(this.goodData.fractionId);
      },
      error: error => {
        console.log(error);
      },
    });
  }

  getSubTypeGood(fractionId: number) {
    this.fractionService.findByFraction(fractionId).subscribe({
      next: resp => {
        this.subType = resp.data[0].siabClasification.typeDescription;
        console.log(this.subType);
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
        this.destinySAE = resp.data[0].description;
        this.destiniSaeSelected = new DefaultSelect(resp.data, resp.count);
      },
      error: error => {
        this.destiniSaeSelected = new DefaultSelect();
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
          this.physicalStatus = data.data[0].description;
          this.selectPhysicalState = new DefaultSelect(data.data, data.count);
          this.goodForm.controls['physicalStatus'].setValue(
            this.goodData.physicalStatus
          );
        },
        error: error => {
          this.selectPhysicalState = new DefaultSelect();
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
          this.conservationState = data.data[0].description;
          this.selectConcervationState = new DefaultSelect(
            data.data,
            data.count
          );
          this.goodForm.controls['stateConservation'].setValue(
            this.goodData.stateConservation
          );
        },
        error: error => {
          this.selectConcervationState = new DefaultSelect();
        },
      });
  }

  //trae datos para verificar cumplimiento

  getDestinyTransferent(id: any) {
    let params = new ListParams();
    params['filter.name'] = '$eq:Destino';
    params['filter.keyId'] = `$eq:${id}`;
    this.genericService
      .getAll(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: ({ data }: any) => {
          this.transferentDestiny = data[0].description;
          this.selectDestiny = new DefaultSelect(data.data, data.count);
          this.goodForm.controls['ligieUnit'].setValue(this.goodData.ligieUnit);
        },
        error: error => {
          this.selectDestiny = new DefaultSelect();
        },
      });
  }

  getDestiny(id: any) {
    if (this.goodData.destiny) {
      let params = new ListParams();
      params['filter.name'] = '$eq:Destino';
      params['filter.keyId'] = `$eq:${id}`;
      this.genericService
        .getAll(params)
        .pipe(takeUntil(this.$unSubscribe))
        .subscribe({
          next: ({ data }: any) => {
            this.ligie = data[0].description;
            this.selectDestinyLigie = new DefaultSelect(data.data, data.count);
            this.goodForm.controls['saeDestiny'].setValue(
              this.goodData.destiny
            );
          },
          error: error => {
            this.selectDestinyLigie = new DefaultSelect();
          },
        });
    }
  }

  getUnitMeasureSae(params: ListParams, id?: string | number) {
    this.goodsQueryService
      .getCatMeasureUnitView(params)
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe({
        next: data => {
          this.unitMeasureLigie = data.data[0].municipality;
          this.selectMeasureUnitSae = new DefaultSelect(data.data, data.count);
          this.goodForm.controls['saeMeasureUnit'].setValue(
            this.goodData.municipality
          );
        },
        error: () => {
          this.selectMeasureUnitSae = new DefaultSelect();
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
      text: '¿Está seguro de querer actualizar la información del bien?',
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
