import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import Keyboard from 'simple-keyboard';

@Component({
  selector: 'app-cat-financial-indicators-modal',
  templateUrl: './cat-financial-indicators-modal.component.html',
  styleUrls: ['./cat-financial-indicators-modal.css'],
})
export class CatFinancialIndicatorsModalComponent implements OnInit {
  value = '';
  keyboard: Keyboard;

  title: string = 'Catálogo de indicadores financieros';
  edit: boolean = false;
  form: FormGroup = new FormGroup({});
  allotment: any;
  @Output() refresh = new EventEmitter<true>();

  get formuleCheck() {
    return this.form.get('formuleCheck');
  }

  constructor(private fb: FormBuilder, private modalRef: BsModalRef) {}

  ngOnInit(): void {
    this.prepareform();
  }

  private prepareform() {
    this.form = this.fb.group({
      id: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null, [Validators.required]],
      formuleCheck: [null, [Validators.required]],
      formule: [null, [Validators.required]],
    });
    if (this.allotment != null) {
      this.edit = true;
      console.log(this.allotment);
      this.form.patchValue(this.allotment);
    }
  }

  close() {
    this.modalRef.hide();
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
}
