import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DefaultEditor } from 'ng2-smart-table';
import { GoodPhotosService } from '../../services/good-photos.service';

@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.css'],
})
export class CheckBoxComponent extends DefaultEditor implements OnInit {
  form: FormGroup = new FormGroup({});
  checked: boolean = null;
  id: string;
  disabled: boolean;
  @Input()
  set value(value: { checked: boolean; disabled: boolean; id: string }) {
    // debugger;
    this.disabled = value.disabled;
    this.checked = value.checked;
    this.id = value.id;
    this.form = this.fb.group({
      check: [value.checked],
    });
  }
  constructor(private fb: FormBuilder, private dataService: GoodPhotosService) {
    super();
  }

  ngOnInit() {
    this.form = this.fb.group({
      check: [this.checked],
    });
    if (this.disabled) this.form.get('check')?.disable();
  }

  get selectedGoods() {
    return this.dataService.selectedGoods;
  }

  set selectedGoods(value) {
    this.dataService.selectedGood;
  }

  onToggle($event: any) {
    if (this.cell) this.cell.newValue = this.form.controls['check'].value;
    let toggle = ($event.target.form[0] as HTMLInputElement).checked;
    console.log(toggle, this.id);
    if (toggle) {
      this.selectedGoods.push(this.id);
    } else {
      const result = this.selectedGoods.findIndex(row => row === this.id);
      console.log(result);
      if (result > -1) {
        if (result === 0) {
          this.selectedGoods = this.selectedGoods.shift();
        } else {
          this.selectedGoods.splice(result, 1);
        }
      }
    }
    console.log(this.selectedGoods);
  }
}
