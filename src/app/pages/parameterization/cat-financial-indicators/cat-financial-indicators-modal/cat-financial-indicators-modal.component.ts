import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Keyboard from 'simple-keyboard';
import { ModelForm } from 'src/app/core/interfaces/model-form';
//models
import { IFinancialIndicators } from 'src/app/core/models/catalogs/financial-indicators-model';
//services
import { FinancialIndicatorsService } from 'src/app/core/services/catalogs/financial-indicators-service';
import { BasePage } from 'src/app/core/shared/base-page';
import { STRING_PATTERN } from 'src/app/core/shared/patterns';

@Component({
  selector: 'app-cat-financial-indicators-modal',
  templateUrl: './cat-financial-indicators-modal.component.html',
  styleUrls: ['./cat-financial-indicators-modal.css'],
})
export class CatFinancialIndicatorsModalComponent
  extends BasePage
  implements OnInit
{
  value = '';
  keyboard: Keyboard;
  financialIndicatorsForm: ModelForm<IFinancialIndicators>;
  financialIndicators: IFinancialIndicators;

  title: string = 'Catálogo de indicadores financieros';
  edit: boolean = false;

  constructor(
    private fb: FormBuilder,
    private modalRef: BsModalRef,
    private financialIndicatorsService: FinancialIndicatorsService
  ) {
    super();
  }

  ngOnInit(): void {
    this.prepareform();
  }

  private prepareform() {
    this.financialIndicatorsForm = this.fb.group({
      id: [null, []],
      name: [null, [Validators.required, Validators.pattern(STRING_PATTERN)]],
      description: [
        null,
        [Validators.required, Validators.pattern(STRING_PATTERN)],
      ],
      formula: [null, [Validators.required]],
    });
    if (this.financialIndicators != null) {
      this.edit = true;
      console.log(this.financialIndicators);
      this.financialIndicatorsForm.patchValue(this.financialIndicators);
    }
  }

  //Teclado virtual
  ngAfterViewInit() {
    this.keyboard = new Keyboard({
      onChange: input => this.onChange(input),
      onKeyPress: (button: string) => this.onKeyPress(button),
      layout: {
        default: ['1 2 3', '4 5 6', '7 8 9', '{shift} 0 _', '{bksp} Elemento'],
        shift: ['! / #', '$ % ^', '& * (', '{shift} ) +', '{bksp}'],
      },
      display: { '{bksp}': 'Eliminar', '{shift}': 'Operadores' },
      theme: 'hg-theme-default hg-layout-numeric numeric-theme',
    });
  }

  onChange = (input: string) => {
    this.value = input;
    console.log('Input changed', input);
  };

  onKeyPress = (button: string) => {
    console.log('Button pressed', button);

    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === '{shift}' || button === '{lock}') this.handleShift();
  };

  onInputChange = (event: any) => {
    this.keyboard.setInput(event.target.value);
  };

  handleShift = () => {
    let currentLayout = this.keyboard.options.layoutName;
    let shiftToggle = currentLayout === 'default' ? 'shift' : 'default';

    this.keyboard.setOptions({
      layoutName: shiftToggle,
    });
  };

  //CRUD
  close() {
    this.modalRef.hide();
  }

  confirm() {
    this.edit ? this.update() : this.create();
  }

  create() {
    this.loading = true;
    this.financialIndicatorsService
      .create(this.financialIndicatorsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  update() {
    this.loading = true;
    console.log(this.financialIndicatorsForm);
    this.financialIndicatorsService
      .update(this.financialIndicators.id, this.financialIndicatorsForm.value)
      .subscribe({
        next: data => this.handleSuccess(),
        error: error => (this.loading = false),
      });
  }

  handleSuccess() {
    const message: string = this.edit ? 'Actualizado' : 'Guardado';
    this.onLoadToast('success', this.title, `${message} Correctamente`);
    this.loading = false;
    this.modalRef.content.callback(true);
    this.modalRef.hide();
  }
}
