import { Component, OnInit } from '@angular/core';
import {
  ADMIN_SIDE_NAVIGATION,
  SIDE_NAVIGATION,
} from '../constants/app.constant';
import { NavigationEnd, Router } from '@angular/router';
import { FeaturesService } from './features.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-features',
  templateUrl: './features.component.html',
  styleUrls: ['./features.component.scss'],
})
export class FeaturesComponent implements OnInit {
  constructor(
    private readonly router: Router,
    private readonly featuresService: FeaturesService,
    private readonly sharedService: SharedService
  ) {}

  public navList: any = [];
  public activeItemLink: string = '/dashboard';
  public activeItem: string = 'All Items';

  public isCollapsed = false;

  ngOnInit(): void {
    this.getUserPlan();
  }

  // getUserPlan() {
  //   this.featuresService.getUserPlan().subscribe({
  //     next: (res: any) => {
  //       if (res?.plan?.screens?.length) {
  //         this.navList = SIDE_NAVIGATION.filter((x) =>
  //           res.plan.screens.find((y: any) => y.name == x.name)
  //         );
  //         console.log('Filtered navigation list:', this.navList);
  //       } else {
  //         console.warn('No screens found in user plan');
  //         this.navList = SIDE_NAVIGATION; // Fallback to show all navigation items
  //       }
  //       this.subscribeToEvent();
  //       if (this.navList.length && !this.activeItemLink) {
  //         this.router.navigate([`${this.navList[0]?.link}`]);
  //       }
  //     },
  //     error: (err) => {
  //       console.error('Error fetching user plan:', err);
  //       this.navList = SIDE_NAVIGATION; // Fallback to show all navigation items
  //       this.sharedService.showToast({
  //         classname: 'error',
  //         text: err?.error?.message || 'Error loading navigation',
  //       });
  //     },
  //   });
  // }
  getUserPlan() {
    // First check if user is admin or super admin
    if (this.sharedService.isAdmin() || this.sharedService.isSuperAdmin()) {
      this.navList = ADMIN_SIDE_NAVIGATION;
      this.subscribeToEvent();
      if (this.navList.length && !this.activeItemLink) {
        this.router.navigate([`${this.navList[0]?.link}`]);
      }
      return;
    }

    // For non-admin users, proceed with the original logic
    this.featuresService.getUserPlan().subscribe({
      next: (res: any) => {
        if (res?.plan?.screens?.length) {
          this.navList = SIDE_NAVIGATION.filter((x) =>
            res.plan.screens.find((y: any) => y.name == x.name)
          );
          console.log('Filtered navigation list:', this.navList);
        } else {
          console.warn('No screens found in user plan');
          this.navList = SIDE_NAVIGATION; // Fallback to show all navigation items
        }
        this.subscribeToEvent();
        if (this.navList.length && !this.activeItemLink) {
          this.router.navigate([`${this.navList[0]?.link}`]);
        }
      },
      error: (err) => {
        console.error('Error fetching user plan:', err);
        this.navList = SIDE_NAVIGATION; // Fallback to show all navigation items
        this.sharedService.showToast({
          classname: 'error',
          text: err?.error?.message || 'Error loading navigation',
        });
      },
    });
  }

  subscribeToEvent() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateActiveNav(event.urlAfterRedirects);
      }
    });
  }

  updateActiveNav(activeItemLink: string) {
    this.activeItemLink = activeItemLink;
    this.activeItem = this.navList.find(
      (x: any) => x.link == activeItemLink
    )?.name;
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }
}
