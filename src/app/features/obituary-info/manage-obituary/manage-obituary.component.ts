import { SoundService } from 'src/app/services/sound.service';
import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ObituaryInfoService } from '../obituary-info.service';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-manage-obituary',
  templateUrl: './manage-obituary.component.html',
  styleUrls: ['./manage-obituary.component.scss'],
})
export class ManageObituaryComponent implements OnInit {
  public obituaryForm: FormGroup;
  @Input() data: any = {};

  constructor(
    private readonly activeModal: NgbActiveModal,
    private readonly formBuilder: UntypedFormBuilder,
    private readonly obituaryService: ObituaryInfoService,
    private readonly sharedService: SharedService,
    private readonly soundService: SoundService
  ) {}

  ngOnInit(): void {
    this.obituaryForm = this.formBuilder.group({
      birth_name: ['', [Validators.required]],
      married_name: [''],
      current_name: ['', [Validators.required]],
      birth_date: [new Date(), [Validators.required]],
      birth_place: ['', [Validators.required]],
      parent_names: ['', [Validators.required]],
      spouse_name: [''],
      children: this.formBuilder.array([]),
      siblings: this.formBuilder.array([]),
    });

    if (this.data?.item) {
      this.patchForm();
    }
  }

  patchForm() {
    this.soundService.playClickSound();
    this.obituaryForm.patchValue({
      birth_name: this.data.item.birth_name,
      married_name: this.data.item.married_name,
      current_name: this.data.item.current_name,
      birth_date: this.data.item.birth_date,
      birth_place: this.data.item.birth_place,
      parent_names: this.data.item.parent_names,
      spouse_name: this.data.item.spouse_name,
    });

    // Patch children and siblings arrays
    this.data.item.children?.forEach((child: any) => this.addChild(child));
    this.data.item.siblings?.forEach((sibling: any) =>
      this.addSibling(sibling)
    );

    this.obituaryForm.updateValueAndValidity();
  }

  addChild(child?: any) {
    const childForm = this.formBuilder.group({
      name: [child?.name || '', Validators.required],
      dateOfBirth: [child?.dateOfBirth || '', Validators.required],
    });
    this.childrenArray.push(childForm);
  }

  removeChild(index: number) {
    this.childrenArray.removeAt(index);
  }

  addSibling(sibling?: any) {
    const siblingForm = this.formBuilder.group({
      name: [sibling?.name || '', Validators.required],
      isAlive: [sibling?.isAlive || false],
    });
    this.siblingsArray.push(siblingForm);
  }

  removeSibling(index: number) {
    this.siblingsArray.removeAt(index);
  }

  get childrenArray() {
    return this.obituaryForm.get('children') as any;
  }

  get siblingsArray() {
    return this.obituaryForm.get('siblings') as any;
  }

  closeModal(): void {
    this.activeModal.close(null);
  }

  submit() {
    this.soundService.playClickSound();
    if (this.obituaryForm.invalid) {
      Object.keys(this.obituaryForm.controls).forEach((key) => {
        const control = this.obituaryForm.get(key);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });
      return;
    }
    const form = this.obituaryForm.value;
    const serviceCall = this.data?.item?.id
      ? this.obituaryService.updateObituaryInfo(form, this.data.item.id)
      : this.obituaryService.createObituaryInfo(form);

    serviceCall.subscribe({
      next: (response: any) => {
        this.sharedService.showToast({
          classname: 'success',
          text: response?.message,
        });
        this.closeModal();
      },
      error: (err: any) => {
        this.sharedService.showToast({
          classname: 'error',
          text: err?.error?.message,
        });
      },
    });
  }
}
