import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ObituaryInfoService } from './obituary-info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';
import { ManageObituaryComponent } from './manage-obituary/manage-obituary.component';
import { ConfirmationModalComponent } from 'src/app/shared/confirmation-modal/confirmation-modal.component';
import {
  ADD_ITEMS_LIST,
  objectToQueryParams,
} from 'src/app/constants/app.constant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-obituary-info',
  templateUrl: './obituary-info.component.html',
  styleUrls: ['./obituary-info.component.scss'],
})
export class ObituaryInfoComponent implements OnInit {
  obituaryForm: FormGroup;
  obituaryInfo: any;
  isEditMode = false;

  private pageOptions: any = {
    pageSize: 20,
    page: 1,
    pagination: false,
  };
  public addCardItems: any = [ADD_ITEMS_LIST.OBITUARY];

  public obituaries: any[] = [];
  public obituariesListByYear: any[] = [];

  constructor(
    private fb: FormBuilder,
    private obituaryInfoService: ObituaryInfoService,
    private modalService: NgbModal,
    private sharedService: SharedService,
    private router: Router
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadObituaryInfo();
    this.getObituaries();
  }

  private initForm(): void {
    this.obituaryForm = this.fb.group({
      birth_name: ['', Validators.required],
      married_name: [''],
      current_name: ['', Validators.required],
      birth_date: ['', Validators.required],
      birth_place: ['', Validators.required],
      parent_names: ['', Validators.required],
      spouse_name: [''],
      children: this.fb.array([]),
      siblings: this.fb.array([]),
    });
  }

  loadObituaryInfo(): void {
    this.obituaryInfoService.getObituaryInfo().subscribe({
      next: (response) => {
        if (response?.data) {
          this.obituaryInfo = response.data;
          this.patchFormValues();
        }
      },
      error: (error) => {
        this.sharedService.showToast({
          classname: 'error',
          text: error?.error?.message,
        });
      },
    });
  }

  private patchFormValues(): void {
    this.obituaryForm.patchValue({
      birth_name: this.obituaryInfo.birth_name,
      married_name: this.obituaryInfo.married_name,
      current_name: this.obituaryInfo.current_name,
      birth_date: this.obituaryInfo.birth_date,
      birth_place: this.obituaryInfo.birth_place,
      parent_names: this.obituaryInfo.parent_names,
      spouse_name: this.obituaryInfo.spouse_name,
    });

    // Clear existing arrays
    (this.obituaryForm.get('children') as FormArray).clear();
    (this.obituaryForm.get('siblings') as FormArray).clear();

    // Add children
    this.obituaryInfo.children?.forEach((child: any) => {
      this.addChild(child);
    });

    // Add siblings
    this.obituaryInfo.siblings?.forEach((sibling: any) => {
      this.addSibling(sibling);
    });
  }

  get childrenArray(): FormArray {
    return this.obituaryForm.get('children') as FormArray;
  }

  get siblingsArray(): FormArray {
    return this.obituaryForm.get('siblings') as FormArray;
  }

  addChild(child = { name: '', dateOfBirth: '' }): void {
    this.childrenArray.push(
      this.fb.group({
        name: [child.name, Validators.required],
        dateOfBirth: [child.dateOfBirth, Validators.required],
      })
    );
  }

  removeChild(index: number): void {
    this.childrenArray.removeAt(index);
  }

  addSibling(sibling = { name: '', isAlive: true }): void {
    this.siblingsArray.push(
      this.fb.group({
        name: [sibling.name, Validators.required],
        isAlive: [sibling.isAlive],
      })
    );
  }

  removeSibling(index: number): void {
    this.siblingsArray.removeAt(index);
  }

  onSubmit(): void {
    if (this.obituaryForm.valid) {
      const payload = this.obituaryForm.value;

      if (this.obituaryInfo?.id) {
        this.obituaryInfoService
          .updateObituaryInfo(payload, this.obituaryInfo.id)
          .subscribe({
            next: (response) => {
              this.sharedService.showToast(
                'Obituary information updated successfully'
              );
              this.loadObituaryInfo();
            },
            error: (error) => {
              this.sharedService.showToast(error);
            },
          });
      } else {
        this.obituaryInfoService.createObituaryInfo(payload).subscribe({
          next: (response) => {
            this.sharedService.showToast(
              'Obituary information saved successfully'
            );
            this.loadObituaryInfo();
          },
          error: (error) => {
            this.sharedService.showToast(error);
          },
        });
      }
    }
  }

  toggleEditMode(): void {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.patchFormValues();
    }
  }

  getObituaryInfo() {
    const queryParams = objectToQueryParams(this.pageOptions);
    this.obituaryInfoService.getObituaryInfo(queryParams).subscribe({
      next: (response) => {
        this.obituaryInfo = response.data;
        if (this.obituaryInfo) {
          this.patchFormValues();
        }
      },
      error: (err) => {
        this.sharedService.showToast({
          classname: 'error',
          text: err?.error?.message,
        });
      },
    });
  }

  openManageObituaryModal(item: any) {
    const modalRef = this.modalService.open(ManageObituaryComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: false,
    });

    modalRef.componentInstance.data = {
      name: item?.id ? 'Edit' : 'Add',
      item: item?.id ? item : null,
    };

    // Handle the modal result
    modalRef.result
      .then((result) => {
        this.getObituaryInfo();
      })
      .catch((error) => console.log(error));
  }

  openDeleteDialog() {
    const modalRef = this.modalService.open(ConfirmationModalComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: false,
    });

    modalRef.componentInstance.data = {
      title: 'Delete Obituary Information',
      text: 'Are you sure you want to delete this obituary information? This action is permanent and cannot be undone.',
    };

    modalRef.result
      .then((result) => {
        this.deleteObituary();
      })
      .catch((error) => console.log(error));
  }

  deleteObituary() {
    if (!this.obituaryInfo?.id) return;

    this.obituaryInfoService
      .deleteObituaryInfo(this.obituaryInfo.id)
      .subscribe({
        next: (response) => {
          this.sharedService.showToast({
            classname: 'success',
            text: response?.message,
          });
          this.obituaryInfo = null;
          this.obituaryForm.reset();
        },
        error: (error) => {
          this.sharedService.showToast({
            classname: 'error',
            text: error?.error?.message,
          });
        },
      });
  }

  getObituaries() {
    const queryParams = objectToQueryParams(this.pageOptions);
    this.obituaryInfoService.getObituaryInfo(queryParams).subscribe({
      next: (response) => {
        this.obituaries = response.data;
        if (this.obituaries && this.obituaries.length)
          this.arrangeObituariesByYear(response.data);
      },
      error: (err) => {
        this.sharedService.showToast({
          classname: 'error',
          text: err?.error?.message,
        });
      },
    });
  }

  // arrangeObituariesByYear(obituaries: any) {
  //   debugger;
  //   this.obituariesListByYear = [];
  //   let startYear = new Date(obituaries[0].birth_date).getFullYear();
  //   let endYear = new Date(
  //     obituaries[obituaries.length - 1].birth_date
  //   ).getFullYear();
  //   while (startYear >= endYear) {
  //     const list = this.obituaries.filter(
  //       (x) => startYear == new Date(x.birth_date).getFullYear()
  //     );
  //     if (list.length) {
  //       this.obituariesListByYear.push(list);
  //     }
  //     startYear--;
  //   }
  // }
  arrangeObituariesByYear(obituaries: any[]) {
    debugger;
    this.obituariesListByYear = [];

    if (!obituaries || obituaries.length === 0) {
      return;
    }

    // Make sure the array is sorted by birth_date (newest first)
    const sortedObituaries = [...obituaries].sort(
      (a, b) =>
        new Date(b.birth_date).getTime() - new Date(a.birth_date).getTime()
    );

    let startYear = new Date(sortedObituaries[0].birth_date).getFullYear();
    let endYear = new Date(
      sortedObituaries[sortedObituaries.length - 1].birth_date
    ).getFullYear();

    while (startYear >= endYear) {
      const list = sortedObituaries.filter(
        (x) => startYear === new Date(x.birth_date).getFullYear()
      );
      if (list.length) {
        this.obituariesListByYear.push(list);
      }
      startYear--;
    }
  }

  openObituaryPopup(item: any) {
    const modalRef = this.modalService.open(ManageObituaryComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: false,
    });

    modalRef.componentInstance.data = {
      name: item?.id ? 'Edit' : 'Add',
      item: item?.id ? item : null,
    };

    modalRef.result
      .then((result) => {
        this.getObituaries();
      })
      .catch((error) => console.log(error));
  }

  // openDeleteDialog(obituary: any) {
  //   const modalRef = this.modalService.open(ConfirmationModalComponent, {
  //     size: 'md',
  //     backdrop: 'static',
  //     keyboard: false,
  //     centered: false,
  //   });

  //   modalRef.componentInstance.data = {
  //     title: 'Delete Obituary',
  //     text: 'Are you sure you want to delete this obituary? This action is permanent and cannot be undone',
  //   };

  //   modalRef.result
  //     .then((result) => {
  //       this.deleteObituary(obituary.id);
  //     })
  //     .catch((error) => console.log(obituary));
  // }

  // deleteObituary(obituaryId: string) {
  //   this.obituaryService.deleteObituary(obituaryId).subscribe({
  //     next: (response) => {
  //       this.sharedService.showToast({
  //         classname: 'success',
  //         text: response?.message,
  //       });
  //       this.getObituaries();
  //     },
  //     error: (err) => {
  //       this.sharedService.showToast({
  //         classname: 'error',
  //         text: err?.error?.message,
  //       });
  //     },
  //   });
  // }

  seeMore(year: any) {
    this.router.navigate([`/obituary-info/${year}`]);
  }
}
