import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
} from '@angular/forms';

type FormControls<T> = {
  [key in keyof T]: T[key] extends ModelForm<any> | FormArray // If control value has type of TForm (nested form) or FormArray
    ? T[key] // Use type that we define in our FormModel
    : Omit<AbstractControl, 'value'> & { value: T[key] }; // Or use custom AbstractControl with typed value
};

export type ModelForm<T> = FormGroup & {
  controls: FormControls<T>;
};

type FormGroupOf<T> = {
  [key in keyof T]: T[key] extends Array<infer TArray>
    ? FormArray<
        TArray extends object
          ? FormGroup<FormGroupOf<TArray>>
          : FormControl<TArray | null | undefined>
      >
    : T[key] extends object
    ? FormGroup<FormGroupOf<T[key]>>
    : FormControl<T[key] | null | undefined>;
};

export type IFormGroup<T> = FormGroup & {
  controls: FormGroupOf<T>;
};
