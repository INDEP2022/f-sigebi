import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IMenageWrite } from 'src/app/core/models/ms-menage/menage.model';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-property-registration',
  templateUrl: './property-registration.component.html',
  styles: [],
})
export class PropertyRegistrationComponent extends BasePage implements OnInit {
  menajes: IGood[] = [];
  params = new BehaviorSubject<ListParams>(new ListParams());
  totalItems: number = 0;
  goods = new DefaultSelect<IGood>();
  expedient: IExpedient;
  numberGoodSelect: number;
  // property to know if I am looking for
  searched: boolean = false;
  addGood: boolean = false;
  enableAddgood: boolean = true;
  textButton: string = 'Agregar menaje';
  //Reactive Forms
  form: FormGroup;
  formGood: FormGroup;
  columnFilters: any = [];
  idGoodValue: number;
  data: LocalDataSource = new LocalDataSource();

  get numberFile() {
    return this.form.get('numberFile');
  }
  get causePenal() {
    return this.form.get('causePenal');
  }
  get preliminaryInquiry() {
    return this.form.get('preliminaryInquiry');
  }
  get goodSelect() {
    return this.form.get('goodSelect');
  }

  constructor(
    private fb: FormBuilder,
    private readonly expedientServices: ExpedientService,
    private readonly goodServices: GoodService,
    private readonly menageServices: MenageService
  ) {
    super();
    this.settings.actions.delete = true;
    this.settings.actions.edit = false;
    this.settings.columns = {
      id: {
        title: 'Menaje',
        width: '20%',
        sort: false,
      },
      description: {
        title: 'Descripción',
        width: '70%',
        sort: false,
      },
    };
  }

  ngOnInit(): void {
    this.buildForm();
    this.form.disable();
    this.formGood.disable();
    this.numberFile.enable();
    this.data.onChanged().pipe(takeUntil(this.$unSubscribe)).subscribe();
    this.params
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.searchGoodMenage(this.idGoodValue));
  }

  private buildForm() {
    this.form = this.fb.group({
      numberFile: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      causePenal: [null],
      preliminaryInquiry: [null],
      goodSelect: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.formGood = this.fb.group({
      goodId: [null, [Validators.required]],
    });
  }

  searchExpedient(event: any) {
    const numberFile = Number(event);
    this.expedientServices.getById(numberFile).subscribe({
      next: response => {
        this.expedient = response;
        this.causePenal.setValue(this.expedient.criminalCase);
        this.preliminaryInquiry.setValue(this.expedient.preliminaryInquiry);
        this.searchGoods(this.expedient.id);
      },
      error: err => {
        this.onLoadToast('error', 'ERROR', 'No existe el registro');
      },
    });
  }

  uploadTableMenaje(good: IGood) {
    this.enableAddgood = false;
    this.formGood.enable();
    this.numberGoodSelect = good.id;
    this.searchGoodMenage(good.id);
  }

  searchGoods(idExpedient: number | string) {
    this.goods = new DefaultSelect([], 0);
    this.goodServices
      .getByExpedient(idExpedient, this.params.getValue())
      .subscribe({
        next: response => {
          this.goodSelect.enable();
          this.goods = new DefaultSelect(response.data, response.count);
        },
        error: err => {
          console.log(err);
        },
      });
  }

  //Función que trae la información luego de enviar el No Expediente
  searchGoodMenage(idGood: number) {
    this.idGoodValue = idGood;
    this.loading = true;
    this.menajes = [];
    this.menageServices.getByGood(idGood, this.params.getValue()).subscribe({
      next: response => {
        this.menajes = response.data.map(menage => {
          return menage.menajeDescription;
        });
        this.totalItems = response.count;
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        // this.onLoadToast('info', 'Información', err.error.message);
      },
    });
  }

  createMenage(idGood: string | number, idGoodMenaje: string | number) {
    const menaje: IMenageWrite = {
      noGood: idGood,
      noGoodMenaje: idGoodMenaje,
      noRegister: 12323,
    };
    this.menageServices.create(menaje).subscribe({
      next: respose => {
        this.searchGoodMenage(this.numberGoodSelect);
        this.onLoadToast(
          'success',
          'Exitoso',
          `Menaje asociado correctamente al bien No ${idGood}`
        );
      },
      error: err => {
        console.log(err);
        this.onLoadToast('error', 'ERROR', err.error.message);
      },
    });
  }

  addMenage(good: IGood) {
    this.createMenage(this.numberGoodSelect, good.id);
  }

  showDeleteAlert(good: IGood) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      '¿Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(good.id);
      }
    });
  }

  delete(idGood: string | number) {
    this.menageServices.remove(idGood).subscribe({
      next: responde => {
        this.searchGoodMenage(this.numberGoodSelect);
        this.onLoadToast(
          'success',
          'Exito',
          `Se elimino el Menaje N° ${idGood}`
        );
      },
      error: err => {
        this.onLoadToast(
          'error',
          'ERROR',
          `No se pudo eliminar el Menaje N° ${idGood}`
        );
      },
    });
  }

  cleandInfo() {
    this.form.reset();
    this.form.disable();
    this.formGood.disable();
    this.numberFile.enable();
    this.goodSelect.enable();
    this.goods = new DefaultSelect([], 0);
    this.menajes = [];
    this.numberGoodSelect = null;
  }

  showGoods() {
    this.addGood = !this.addGood;
    this.addGood
      ? (this.textButton = 'Ocultar registro')
      : (this.textButton = 'Agregar menaje');
  }
}
