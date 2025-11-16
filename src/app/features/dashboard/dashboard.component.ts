import { LegacyComponent } from './../legacy/legacy.component';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ADD_ITEMS_LIST } from 'src/app/constants/app.constant';
import { ManageNotesComponent } from '../notes/manage-notes/manage-notes.component';
import { ManagePasswordComponent } from '../passwords/manage-password/manage-password.component';
import { ManageMemoriesComponent } from '../memories/manage-memories/manage-memories.component';
import { SubscriptionGuard } from 'src/app/guards/subscription.guard';
import { SharedService } from 'src/app/services/shared.service';
import { SoundService } from 'src/app/services/sound.service';
import { KeyHolderService } from '../../services/key-holder.service';
import { ReferFriendModalComponent } from '../refer-friend-modal/refer-friend-modal.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  hasKeyHolders: boolean = false;

  constructor(
    private readonly ngbModalService: NgbModal,
    private sharedService: SharedService,
    private subscriptionGuard: SubscriptionGuard,
    private soundService: SoundService,
    private router: Router,
    private keyHolderService: KeyHolderService
  ) {}

  ngOnInit() {
    this.checkKeyHolders();
  }

  checkKeyHolders() {
    debugger;
    this.keyHolderService.getKeyHolders().subscribe({
      next: (response: any) => {
        this.hasKeyHolders = response && response.data.length > 0;
      },
      error: () => {
        this.hasKeyHolders = false;
      },
    });
  }

  public addCardItems: any = [
    ADD_ITEMS_LIST.MEMORIES,
    ADD_ITEMS_LIST.NOTES,
    // ADD_ITEMS_LIST.ASSETS,
    ADD_ITEMS_LIST.LEGACY,
  ];

  public addComponent(event: any) {
    console.log(event);
    if (!this.hasKeyHolders) {
      this.sharedService.showToast({
        classname: 'warning',
        text: 'Please assign at least one key holder to access this feature.',
      });
      this.router.navigate(['/key-holders']);
      return;
    }

    switch (event.component) {
      case ADD_ITEMS_LIST.NOTES.label:
        this.addNote();
        break;
      case ADD_ITEMS_LIST.PASSWORDS.label:
        this.addPassword();
        break;
      case ADD_ITEMS_LIST.MEMORIES.label:
        this.addMemories();
        break;
      case ADD_ITEMS_LIST.LEGACY.label:
        this.referFriend();
        break;
      default:
        return;
    }
  }

  canActivate(): boolean {
    // Use SubscriptionGuard logic to check subscription
    const userToken = this.sharedService.userToken;
    if (!userToken) {
      this.sharedService.showToast({
        classname: 'danger',
        text: 'Please login to continue.',
      });
      return false;
    }
    const decoded: any = userToken
      ? JSON.parse(atob(userToken.split('.')[1]))
      : {};
    if (decoded && decoded.subscription && decoded.subscription !== 'none') {
      return true;
    }
    this.sharedService.showToast({
      classname: 'warning',
      text: 'Please subscribe to a plan to access this feature.',
    });
    window.location.href = '/subscription-plans';
    return false;
  }
  referFriend() {
    console.log('Refer a Friend clicked');
    this.soundService.playClickSound();
    const modalRef = this.ngbModalService.open(ReferFriendModalComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: false,
    });

    // Set the modal data
    modalRef.componentInstance.data = {
      name: 'Add',
      item: null,
    };

    // Handle the modal result
    modalRef.result
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log(error));
  }
  addPassword() {
    // Open the modal
    this.soundService.playClickSound();

    const modalRef = this.ngbModalService.open(ManagePasswordComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: false,
    });

    // Set the modal data
    modalRef.componentInstance.data = {
      name: 'Add',
      item: null,
    };

    // Handle the modal result
    modalRef.result
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log(error));
  }

  addNote() {
    // Open the modal
    this.soundService.playClickSound();

    if (!this.canActivate()) return;
    const modalRef = this.ngbModalService.open(ManageNotesComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: false,
    });

    // Set the modal data
    modalRef.componentInstance.data = {
      name: 'Add',
      item: null,
    };

    // Handle the modal result
    modalRef.result
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log(error));
  }

  addMemories() {
    this.soundService.playClickSound(); // Play sound on add memories button click
    if (!this.canActivate()) return;
    // Open the modal
    const modalRef = this.ngbModalService.open(ManageMemoriesComponent, {
      size: 'md',
      backdrop: 'static',
      keyboard: false,
      centered: false,
    });

    // Set the modal data
    modalRef.componentInstance.data = {
      name: 'Add',
      item: null,
    };

    // Handle the modal result
    modalRef.result
      .then((result) => {
        console.log(result);
      })
      .catch((error) => console.log(error));
  }
}
