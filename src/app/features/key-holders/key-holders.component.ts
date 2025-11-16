import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/services/shared.service';
import { KeyHolderService } from './key-holders.service';
import { ManageKeyHoldersComponent } from './manage-key-holders/manage-key-holders.component';
import { BE_URL } from 'src/app/constants/app.constant';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-key-holders',
  templateUrl: './key-holders.component.html',
  styleUrls: ['./key-holders.component.scss'],
})
export class KeyHoldersComponent implements OnInit {
  public keyholders: any[] = [];
  public isKeyHolder: boolean = this.sharedService.isKeyHolder();

  constructor(
    private readonly keyHolderService: KeyHolderService,
    private readonly ngbModalService: NgbModal,
    private readonly sharedService: SharedService,
    private soundService: SoundService
  ) {}

  // public addCardItems: any = [
  //   ADD_ITEMS_LIST.KEY_HOLDERS
  // ]

  ngOnInit(): void {
    this.getKeyHolders();
  }

  getKeyHolders() {
    this.keyHolderService.getKeyHolders().subscribe({
      next: (response) => {
        if (response?.data && response?.data.length) {
          this.keyholders = response.data.map((item: any) => {
            return {
              ...item,
              image_path: item?.image_path
                ? BE_URL + item?.image_path?.slice(1)
                : null,
            };
          });
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

  openKeyHolderPopup(item: any) {
    this.soundService.playClickSound();
    // Open the modal
    const modalRef = this.ngbModalService.open(ManageKeyHoldersComponent, {
      size: 'lg',
      backdrop: 'static',
      keyboard: false,
      centered: false,
    });

    // Set the modal data
    modalRef.componentInstance.data = {
      name: item?.id ? 'Edit' : 'Add',
      item: item?.id ? item : null,
    };

    // Handle the modal result
    modalRef.result
      .then((result) => {
        this.getKeyHolders();
      })
      .catch((error) => console.log(error));
  }
}
