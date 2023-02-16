import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { IExpedient } from 'src/app/core/models/ms-expedient/expedient';
import { IGood } from 'src/app/core/models/ms-good/good';
import { IMenageWrite } from 'src/app/core/models/ms-menage/menage.model';
import { ExpedientService } from 'src/app/core/services/ms-expedient/expedient.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { MenageService } from 'src/app/core/services/ms-menage/menage.service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-property-registration',
  templateUrl: './property-registration.component.html',
  styles: [],
})
export class PropertyRegistrationComponent extends BasePage implements OnInit {
  totalItems: number = 0;
  params = new BehaviorSubject<ListParams>(new ListParams());

  //Data Table

  //Data Table bien padre
  settings1 = {
    ...this.settings,
    actions: false,
    columns: {
      id: {
        title: 'No Bien',
        width: '10%',
        sort: false,
      },
      description: {
        title: 'Descripcion',
        width: '40%',
        sort: false,
      },
    },
  };

  /* goods: IGood[] = []; */
  goods = new DefaultSelect<IGood>();
  menajes: IGood[] = [];
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
        title: 'Descripcion',
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
  }

  /**
   * @method: metodo para iniciar el formulario
   * @author:  Alexander Alvarez
   * @since: 27/09/2022
   */

  private buildForm() {
    this.form = this.fb.group({
      numberFile: [null, [Validators.required]],
      causePenal: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      preliminaryInquiry: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      goodSelect: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
    });
    this.formGood = this.fb.group({
      goodId: [null, [Validators.required]],
    });
  }

  searchExpedient() {
    const numberFile = Number(this.numberFile.value);
    this.expedientServices.getById(numberFile).subscribe({
      next: response => {
        console.log(response);
        this.expedient = response;
        this.causePenal.setValue(this.expedient.criminalCase);
        this.preliminaryInquiry.setValue(this.expedient.preliminaryInquiry);
        this.searchGoods(this.expedient.id);
        /* this.onLoadToast('success', 'Encontrado', 'Expediente encontrado'); */
      },
      error: err => {
        console.log(err);
        this.onLoadToast('error', 'ERROR', 'No existe el Registro');
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
          this.goods = new DefaultSelect(response.data, response.count);
          this.goodSelect.enable();
        },
        error: err => {
          console.log(err);
        },
      });
  }
  searchGoodMenage(idGood: number) {
    this.menajes = [];
    this.loading = true;
    this.menageServices.getByGood(idGood).subscribe({
      next: response => {
        this.menajes = response.data.map(menage => {
          return menage.menajeDescription;
        });
        this.totalItems = response.count;
        console.log(this.menajes);
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        console.log(err);
        this.onLoadToast('error', 'ERROR', err.error.message);
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
        console.log(respose);
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
    console.log(good);
    this.createMenage(this.numberGoodSelect, good.id);
  }

  showDeleteAlert(good: IGood) {
    this.alertQuestion(
      'warning',
      'Eliminar',
      'Desea eliminar este registro?'
    ).then(question => {
      if (question.isConfirmed) {
        this.delete(good.id);
      }
    });
  }
  delete(idGood: string | number) {
    this.menageServices.remove(idGood).subscribe({
      next: responde => {
        console.log(responde);
        this.searchGoodMenage(this.numberGoodSelect);
        this.onLoadToast(
          'success',
          'Exito',
          `Se elimino el Menaje N° ${idGood}`
        );
      },
      error: err => {
        console.log(err);
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
    this.goods = new DefaultSelect([], 0);
    this.menajes = [];
  }
  showGoods() {
    this.addGood = !this.addGood;
    this.addGood
      ? (this.textButton = 'Ocultar registro')
      : (this.textButton = 'Agregar menaje');
  }
}
