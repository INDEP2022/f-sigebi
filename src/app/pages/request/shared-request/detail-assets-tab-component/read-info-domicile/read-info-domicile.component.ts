import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ModelForm } from 'src/app/core/interfaces/model-form';

@Component({
  selector: 'app-read-info-domicile',
  templateUrl: './read-info-domicile.component.html',
  styles: [],
})
export class ReadInfoDomicileComponent implements OnInit, OnChanges {
  @Input() domicileForm: ModelForm<any>;
  domicile: any;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('domicilio 1', this.domicileForm);
    this.domicile = this.domicileForm.value;
    console.log('domicilio', this.domicile);
  }

  ngOnInit(): void {}
}
