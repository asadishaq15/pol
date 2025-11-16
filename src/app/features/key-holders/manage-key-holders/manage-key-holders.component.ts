import { Component, Input } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { KeyHolderService } from '../key-holders.service';
import { SharedService } from 'src/app/services/shared.service';
import { DomSanitizer } from '@angular/platform-browser';
import { RELATION_LIST } from 'src/app/constants/app.constant';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-manage-key-holders',
  templateUrl: './manage-key-holders.component.html',
  styleUrls: ['./manage-key-holders.component.scss'],
})
export class ManageKeyHoldersComponent {
  public keyHolderForm: FormGroup;
  @Input() data: any = {};
  public imageUrl: any;
  private uploadedFile: any;
  public relationList = RELATION_LIST;

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly keyHolderService: KeyHolderService,
    private readonly sharedService: SharedService,
    private readonly sanitizer: DomSanitizer,
    private readonly soundService: SoundService
  ) {}

  ngOnInit(): void {
    this.keyHolderForm = this.formBuilder.group({
      file: [''],
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', Validators.required],
      phone_number: [''],
      relation: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
    });

    if (this.data?.item?.id) {
      this.patchForm();
    }
  }

  // patchForm() {
  //   this.keyHolderForm.patchValue({
  //     first_name: this.data.item.first_name,
  //     last_name: this.data.item.last_name,
  //     email: this.data.item.email,
  //     phone_number: this.data.item.phone_number,
  //     address: this.data.item.address,
  //     relation: this.data.item.relation,
  //   });
  //   this.keyHolderForm.updateValueAndValidity();
  // }
  patchForm() {
    this.keyHolderForm.patchValue({
      first_name: this.data.item.first_name,
      last_name: this.data.item.last_name,
      email: this.data.item.email,
      phone_number: this.data.item.phone_number,
      relation: this.data.item.relation,
      street: this.data.item.street,
      city: this.data.item.city,
      state: this.data.item.state,
      zip: this.data.item.zip,
    });
    this.keyHolderForm.updateValueAndValidity();
  }

  submit() {
    this.soundService.playClickSound();
    console.log(this.keyHolderForm);
    if (this.keyHolderForm.invalid) {
      this.sharedService.showToast({
        classname: 'warning',
        text: 'Please fill all required fields.',
      });
      return;
    } else {
      const form = this.keyHolderForm.value;
      const file = this.uploadedFile ? this.uploadedFile : null;
      this.keyHolderService
        .addKeyHolder(file, {
          // file: form.file,
          first_name: form.first_name,
          last_name: form.last_name,
          email: form.email,
          phone_number: form.phone_number,
          street: form.street,
          city: form.city,
          state: form.state,
          zip: form.zip,
          relation: form.relation,
        })
        .subscribe({
          next: (response) => {
            this.sharedService.showToast({
              classname: 'success',
              text: response?.message,
            });
            this.closeModal();
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

  closeModal(): void {
    this.activeModal.close(null);
  }

  onFileChange(file: any) {
    this.uploadedFile = file[0];
    const objectURL = URL.createObjectURL(file[0]);
    this.imageUrl = this.sanitizer.bypassSecurityTrustUrl(objectURL);
  }
}
