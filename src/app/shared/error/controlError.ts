import { AsyncPipe } from "@angular/common";
import { ChangeDetectionStrategy, Component, InjectionToken, Input, OnDestroy, OnInit, inject } from "@angular/core";
import { FormGroupDirective, ValidationErrors } from "@angular/forms";
import { BehaviorSubject, Subscription, distinctUntilChanged, merge } from "rxjs";
import { AbstractControl } from "@angular/forms";

const defaultErrors: {[key: string]: any} = {
    required: () => `Kötelezően kitöltendő`,
    minlength: ({ requiredLength, actualLength }: any) => `Legalább ${requiredLength} hosszúnak kell lennie.`,
    maxlength: ({ requiredLength, actualLength }: any) => `Maximum ${requiredLength} hosszúnak kell lennie.`,
    email: () => `Nem email formátum`,
    
  };
  
  export const FORM_ERRORS = new InjectionToken('FORM_ERRORS', {
    providedIn: 'root',
    factory: () => defaultErrors,
  });

@Component({
    standalone: true,
    selector: 'control-error',
    imports: [AsyncPipe],
    template: '<div class="alert alert-danger">{{ message$ | async }}</div>',
    changeDetection: ChangeDetectionStrategy.OnPush,
  })

  export class ControlErrorComponent implements OnInit, OnDestroy {
   
    private subscription = new Subscription();
    private formGroupDirective = inject(FormGroupDirective);
    errors = inject(FORM_ERRORS);
    message$ = new BehaviorSubject<string>('');
  
    @Input() controlName!: string;
    @Input() customErrors?: ValidationErrors;
  
    ngOnInit(): void {
      if (this.formGroupDirective) {
        const control = this.formGroupDirective.control.get(this.controlName);
  
        if (control) {
          this.subscription = merge(control.valueChanges, this.formGroupDirective.ngSubmit)
            .pipe(distinctUntilChanged())
            .subscribe(() => {
              const controlErrors = control.errors;
  
              if (controlErrors) {
                const firstKey = Object.keys(controlErrors)[0];
                const getError = this.errors[firstKey];
                const text = this.customErrors?.[firstKey] || getError(controlErrors[firstKey]);
                
  
                this.setError(text);
              } else {
                this.setError('');
              }
            });
        } else {
          const message = this.controlName
            ? `Control "${this.controlName}" not found in the form group.`
            : `Input controlName is required`;
          console.error(message);
        }
      } else {
        console.error(`ErrorComponent must be used within a FormGroupDirective.`);
      }
    }
  
    setError(text: string) {
      this.message$.next(text);
    }
  
    ngOnDestroy(): void {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  }
