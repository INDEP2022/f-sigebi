import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BasePage } from 'src/app/core/shared/base-page';
import { DefaultSelect } from 'src/app/shared/components/select/default-select';
import { IMAGE_DEBUGGING_COLUMNS } from './image-debugging-columns';

@Component({
  selector: 'app-image-debugging',
  templateUrl: './image-debugging.component.html',
  styles: [],
})
export class ImageDebuggingComponent extends BasePage implements OnInit {
  form = this.fb.group({
    bien: [null, [Validators.required]],
    estatus: [null, [Validators.required]],
    expediente: [null, [Validators.required]],
    evento: [null, [Validators.required]],
    lote: [null, [Validators.required]],
    listado: [null, [Validators.required]],
  });
  select = new DefaultSelect();
  constructor(private fb: FormBuilder) {
    super();
    this.settings.actions = false;
    this.settings.columns = IMAGE_DEBUGGING_COLUMNS;
  }

  ngOnInit(): void {}
}
