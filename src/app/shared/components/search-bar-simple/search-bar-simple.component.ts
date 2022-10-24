import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'search-bar-simple',
  template: `
    <div class="form-group form-secondary d-flex justify-content-center">
      <label class="search-label">{{ label }}</label>
      <div class="">
        <input
          type="text"
          class="form-control"
          [formControl]="search"
          [placeholder]="placeholder"
          [(ngModel)]="term" />
      </div>
      <div>
        <input
          value="{{ valueBut }}"
          (click)="searchTerm()"
          type="submit"
          class="btn btn-primary active" />
      </div>
    </div>
  `,
  styles: [],
})
export class SearchBarSimpleComponent implements OnInit {
  @Input() label?: string = 'Buscar:';
  @Input() placeholder?: string = 'Placeholder...';
  @Input() valueBut?: string = 'Buscar';
  @Output() eventEmit = new EventEmitter<string>();
  term: string = '';

  search: FormControl = new FormControl();
  constructor() {}

  ngOnInit(): void {
    console.log(this.placeholder);
    console.log(this.valueBut);
  }

  searchTerm() {
    console.log(this.term);
    this.eventEmit.emit(this.term);
  }
}
