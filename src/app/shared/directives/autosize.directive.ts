import {
  Directive,
  ElementRef,
  HostListener,
  Optional,
  Self,
} from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: 'textarea[autosize]',
  host: {
    '(input)': '$event',
  },
})
export class AutoSizeDirective {
  private $unSubscribe = new Subject<void>();
  constructor(
    public ref: ElementRef<HTMLTextAreaElement>,
    @Optional()
    @Self()
    private model: NgControl
  ) {}

  ngOnInit() {
    this.model.valueChanges
      .pipe(takeUntil(this.$unSubscribe))
      .subscribe(() => this.onChangeInput());
  }

  onChangeInput() {
    this.resize();
  }

  @HostListener('input', ['$event']) onInput($event: InputEvent) {
    this.resize();
  }

  private resize() {
    this.ref.nativeElement.style.height = '0';
    const size = this.ref.nativeElement.scrollHeight + 2;
    this.ref.nativeElement.style.setProperty(
      `height`,
      `${size}px`,
      'important'
    );
  }

  ngOnDestroy() {
    this.$unSubscribe.next();
    this.$unSubscribe.complete();
  }
}
