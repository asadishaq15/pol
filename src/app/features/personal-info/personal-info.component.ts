import { Component, OnInit } from '@angular/core';
import { PersonalInfoService } from './personal-info.service';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from 'src/app/services/file.service';
import { DomSanitizer } from '@angular/platform-browser';
import {
  dateToIsoString,
  isoStringToDateObj,
} from 'src/app/constants/app.constant';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.scss'],
})
export class PersonalInfoComponent implements OnInit {
  constructor(
    private readonly formBuilder: UntypedFormBuilder,
    private readonly personalInfoService: PersonalInfoService,
    private readonly fileService: FileService,
    private readonly sanitizer: DomSanitizer,
    private readonly sharedService: SharedService
  ) {}

  public imageUrl: any;
  public personalInfoForm: FormGroup;
  private personalDetails: any;
  public showPassword: boolean = false;

  ngOnInit(): void {
    this.personalInfoForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: [''],
      phone_number: [''],
      address: [''],
      permanent_address: [''],
      hashed_password: ['', Validators.required],
      date_of_birth: [null],
    });
    this.getPresonalInfo();
    this.getProfilePic();
  }

  getPresonalInfo() {
    this.personalInfoService.getPersonalInfo().subscribe({
      next: (res) => {
        this.personalDetails = res;
        this.patchForm();
      },
      error: (err) => {
        this.sharedService.showToast({
          classname: 'error',
          text: err?.error?.message,
        });
      },
    });
  }

  patchForm() {
    this.personalDetails.date_of_birth = isoStringToDateObj(
      this.personalDetails.date_of_birth
    );
    this.personalInfoForm.patchValue(this.personalDetails);
    this.personalInfoForm.updateValueAndValidity();
  }

  getProfilePic() {
    debugger;
    const path = 'personal-info/profile-pic';
    this.fileService.getFile(path).subscribe({
      next: (blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
      },
      error: (err) => {
        this.sharedService.showToast({
          classname: 'error',
          text: err?.error?.message,
        });
      },
    });
  }

  submit() {
    console.log(this.personalInfoForm);
    if (this.personalInfoForm.invalid) {
      console.log('Form invalid');
      return;
    } else {
      const form = this.personalInfoForm.value;
      this.personalInfoService
        .update({
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone_number: form.phone_number,
          address: form.address,
          permanent_address: form.permanent_address,
          date_of_birth: dateToIsoString(form.date_of_birth),
          hashed_password: form.hashed_password,
        })
        .subscribe({
          next: (response) => {
            this.sharedService.showToast({
              classname: 'success',
              text: response?.message,
            });
            this.personalDetails = response.data;
            this.patchForm();
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

  cancel() {
    this.personalInfoForm.patchValue(this.personalDetails);
  }

  uploadFile(file: any) {
    const path = 'personal-info/upload-profile-pic';
    this.fileService.uploadFile(path, file[0]).subscribe({
      next: (blob) => {
        const objectURL = URL.createObjectURL(blob);
        this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
        this.sharedService.showToast({
          classname: 'success',
          text: 'Profile picture successfully uploaded',
        });
      },
      error: (err) => {
        this.sharedService.showToast({
          classname: 'error',
          text: err?.error?.message,
        });
      },
    });
  }

  upgradePlan() {}
}
