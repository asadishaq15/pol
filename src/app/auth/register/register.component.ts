import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  UntypedFormBuilder,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/services/shared.service';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly sharedService: SharedService,
    private soundService: SoundService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        agreeToTerms: [false, Validators.requiredTrue],
      },
      {
        validator: this.passwordMatchValidator.bind(this),
      }
    );
    // this.registerForm.addValidators(this.passwordMatchValidator as ValidatorFn);

    // // Subscribe to password changes to revalidate confirmPassword
    // this.registerForm.get('password')?.valueChanges.subscribe(() => {
    //   this.registerForm.get('confirmPassword')?.updateValueAndValidity();
    // });
  }

  // passwordMatchValidator(
  //   formGroup: FormGroup
  // ): { [key: string]: boolean } | null {
  //   const password = formGroup.get('password');
  //   const confirmPassword = formGroup.get('confirmPassword');

  //   if (
  //     password &&
  //     confirmPassword &&
  //     password.value !== confirmPassword.value
  //   ) {
  //     return { mismatch: true };
  //   }
  //   return null;
  // }
  passwordMatchValidator(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const confirmPassword = formGroup.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      formGroup.get('confirmPassword')?.setErrors({ mismatch: true });
    } else {
      // Only clear the error if other validators are not failing
      if (formGroup.get('confirmPassword')?.hasError('mismatch')) {
        formGroup.get('confirmPassword')?.setErrors(null);
      }
    }
  }

  register() {
    this.soundService.playClickSound(); // Play sound on register button click
    if (this.registerForm.invalid) {
      this.sharedService.showToast({
        classname: 'error',
        text: 'Please fill in all required fields correctly.',
      });
      return;
    }
    const form = this.registerForm.value;
    console.log(form);
    this.authService
      .register({
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        hashed_password: form.password,
      })
      .subscribe({
        next: (response) => {
          this.sharedService.showToast({
            classname: 'success',
            text: response?.message,
          });
          this.router.navigate(['/auth/login']);
        },
        error: (err) => {
          this.sharedService.showToast({
            classname: 'error',
            text: err?.error?.message,
          });
        },
      });
  }
}
