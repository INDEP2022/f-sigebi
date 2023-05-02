import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styles: [],
})
export class TransferComponent implements OnInit {
  form = this.fb.group({
    transerente: [null, [Validators.required]],
    emisora: [null, [Validators.required]],
    autoridad: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {}
}
