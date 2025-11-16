import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { SharedService } from 'src/app/services/shared.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-register-keyholder',
  templateUrl: './register-keyholder.component.html',
  styleUrls: ['./register-keyholder.component.scss'],
})
export class RegisterKeyholderComponent implements OnInit {
  public loginKeyHolderForm: FormGroup;
  private tokenURL: string | null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loginKeyHolderForm = this.formBuilder.group({
      pin: ['', Validators.required],
    });

    this.activatedRoute.paramMap.subscribe((params) => {
      this.tokenURL = params.get('tokenURL');
      if (this.tokenURL) this.getKeyHolder(this.tokenURL);
    });
  }

  getKeyHolder(tokenURL: string) {
    this.authService.getKeyHolder(tokenURL).subscribe({
      next: (res: any) => {},
      error: (err) => {
        this.sharedService.showToast({
          classname: 'error',
          text: err?.error?.message,
        });
      },
    });
  }

  submit() {
    if (this.loginKeyHolderForm.valid) {
      this.authService
        .loginKeyHolder({
          token_url: this.tokenURL,
          pin: this.loginKeyHolderForm.value.pin,
        })
        .pipe(
          tap((response) => {
            // Authorization
            const token = response.headers.get('Authorization');
            this.sharedService.setUserToken(token);
            localStorage.setItem('isKeyHolder', 'true');
          })
        )
        .subscribe({
          next: (res: any) => {
            this.sharedService.showToast({
              classname: 'success',
              text: 'Login successful!',
            });
            this.router.navigate(['/dashboard']);
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
}
