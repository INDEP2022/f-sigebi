import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ListParams } from 'src/app/common/repository/interfaces/list-params';
import { InstitutionClasificationService } from 'src/app/core/services/catalogs/institution-classification.service';
import { ProeficientService } from 'src/app/core/services/catalogs/proficient.service';
import { DynamicCatalogService } from 'src/app/core/services/dynamic-catalogs/dynamic-catalogs.service';
import { GoodService } from 'src/app/core/services/ms-good/good.service';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';
import { DefaultSelect } from '../../../shared/components/select/default-select';

@Component({
  selector: 'app-complement-article',
  templateUrl: './complement-article.component.html',
  styles: [],
})
export class ComplementArticleComponent implements OnInit {
  form: FormGroup;
  itemsSelect = new DefaultSelect();
  proeficientSelect = new DefaultSelect();
  institutionSelect = new DefaultSelect();
  currencySelect = new DefaultSelect();
  dataGoods: any[];
  idGood: string | number;
  goodSelected: string = 'No se seleccionó bien';

  constructor(
    private fb: FormBuilder,
    private serviceGood: GoodService,
    private serviceProeficient: ProeficientService,
    private serviceInstitution: InstitutionClasificationService,
    private render: Renderer2,
    private serviceDynamicCat: DynamicCatalogService
  ) {}

  ngOnInit(): void {
    this.prepareForm();
  }

  prepareForm() {
    this.form = this.fb.group({
      expediente: [null, [Validators.required]],
      fechaFe: [null, [Validators.required]],
      noBien: [null, [Validators.required]],
      descripcion: [null, [Validators.required]],
      clasificacion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      remarks: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      solicitud: [null, [Validators.required]],
      importe: [null, [Validators.required]],
      moneda: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      fechaVigencia: [null, [Validators.required]],
      fechaAvaluo: [null, [Validators.required]],
      perito: [null, [Validators.required]],
      institucion: [null, [Validators.required]],
      fechaDictamen: [null, [Validators.required]],
      dictamenPerito: [null, [Validators.required]],
      dictamenInstitucion: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      dictamenPerenidad: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      fechaAseg: [null, [Validators.required]],
      notificado: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      lugar: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
    });
  }

  toggleButton(data: string, idBtn: string) {
    const btn = document.getElementById(idBtn);
    if (this.form.get(data).value.length != 0) {
      this.render.removeClass(btn, 'disabled');
      this.render.addClass(btn, 'enabled');
    } else {
      this.render.removeClass(btn, 'enabled');
      this.render.addClass(btn, 'disabled');
    }
  }

  getCurrency(params: ListParams) {
    this.serviceDynamicCat.getCurrency(3, params).subscribe(
      res => {
        this.currencySelect = new DefaultSelect(res.data, res.count);
        console.log(res);
      },
      err => {
        console.log(err);
      }
    );
  }

  getGoodData(id: string | number) {
    this.serviceGood.getById(id).subscribe(
      res => {
        console.log(res);
        this.goodSelected = res.description;
        this.idGood = res.id;
        res.goodCategory != null
          ? this.form.get('clasificacion').setValue(res.goodCategory)
          : this.form.get('clasificacion').setValue('');
        res.originSignals != null
          ? this.form.get('remarks').setValue(res.originSignals)
          : this.form.get('remarks').setValue('');
        res.appraisedValue != null
          ? this.form.get('importe').setValue(res.appraisedValue)
          : this.form.get('importe').setValue('');
        res.appraisalCurrencyKey != null
          ? this.form.get('moneda').setValue(res.appraisalCurrencyKey)
          : this.form.get('moneda').setValue('');
      },
      err => {
        console.log(err);
      }
    );
  }

  tryE() {
    console.log('Funciona');
  }

  getInstitutions(param: ListParams) {
    this.serviceInstitution.getAll(param).subscribe(
      res => {
        this.institutionSelect = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }

  getProeficients(param: ListParams) {
    this.serviceProeficient.getAll(param).subscribe(
      res => {
        this.proeficientSelect = new DefaultSelect(res.data, res.count);
      },
      err => {
        console.log(err);
      }
    );
  }

  getGoodsByExpedient() {
    this.serviceGood
      .getByExpedient(this.form.get('expediente').value, {
        text: '?expedient=',
      })
      .subscribe({
        next: (res: any) => {
          this.dataGoods = res.data;
          console.log(this.dataGoods);
        },
        error: (err: any) => {
          console.error(err);
        },
      });
  }
}
