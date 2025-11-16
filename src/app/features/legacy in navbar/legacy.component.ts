// src/app/pages/legacy/legacy.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeroComponent } from '../../components/hero/hero.component';
import { fadeInOnScroll } from '../../services/animations';
import { ButtonComponent } from 'src/app/shared/button/button.component';
import { Router } from '@angular/router';
import { SoundService } from 'src/app/services/sound.service';
import { Token } from '@angular/compiler';

interface LegacyCard {
  title: string;
  description: string;
  icon: string;
  gradient: string;
}

interface PlanCard {
  title: string;
  price: number;
  membership?: string;
  auto?: string;
  description: string;
  features: string[];
  gradient: string;
}

@Component({
  selector: 'app-legacy-navbar',
  // standalone: true,
  // imports: [CommonModule, HeroComponent, ButtonComponent],
  templateUrl: './legacy.component.html',
  styleUrls: ['./legacy.component.scss'],
  // animations: [fadeInOnScroll],
})
export class LegacyNavbarComponent implements OnInit {
  showMomentsModal = false;
  constructor(private router: Router, private soundService: SoundService) {}
  legacyCards: LegacyCard[] = [
    {
      title: 'Moments to Share',
      description:
        'Click this box to view suggestions on moments you can share. This section lists some ideas that will hopefully jumpstart your memory allowing you to leave the kind of video, audio or note you desire.',
      icon: 'assets/icons/side-bar/passwords.svg',
      gradient: 'red-green',
    },

    {
      title: 'Written Notes',
      description:
        'Click this box to title and begin journaling your memories to share. You can attach photos and describe the moment for loved ones.',
      icon: 'assets/icons/side-bar/notes.svg ',
      gradient: 'yellow-green',
    },
    {
      title: 'Audio Box',
      description:
        'Click this box to begin leaving audio of your memories.Click here to listen to a sample audio',
      icon: 'assets/icons/side-bar/assets.svg',
      gradient: 'orange-green',
    },

    {
      title: 'Video Box',
      description:
        'Click here to begin a video of you talking to your loved ones.Click here to view a sample video',
      icon: 'assets/icons/side-bar/memories.svg',
      gradient: 'purple-orange',
    },
    {
      title: 'Other',
      description: 'Write anything you want to say in this section.',
      icon: 'assets/icons/side-bar/personal-info.svg',
      gradient: 'red-pink',
    },
  ];

  planCards: PlanCard[] = [
    // {
    //   title: 'Auto Obituary Plan',
    //   price: 0,
    //   description:
    //     'This plan allows you to create an obituary that will be automatically generated based on the information you provide. It includes basic details about your life, achievements, and family.',
    //   features: [
    //     'Create a basic obituary with essential details.',
    //     'Includes family information and achievements.',
    //   ],
    //   gradient: 'yellow',
    // },
    // {
    //   title: 'Advanced Auto-Obituary Plan',
    //   price: 3,
    //   description:
    //     'Leave the comfort of the sound of your voice. Make a video of you talking singing etc. (Look in the Moments to share section for talking topics). Includes the auto-obituary plan plus video memories, picture stories, audio notes.',
    //   features: [
    //     'Record up to five – 3 minute videos per year.',
    //     'Show up to 10 family pictures w/ audio recorded descriptions.',
    //   ],
    //   gradient: 'blue',
    // },
    {
      title: 'Legacy Creation Plan',
      price: 7,
      membership: 'One Year Membership $84',
      auto: 'Automatic Renewal',
      description:
        'Leave the comfort of the sound of your voice. Make a video of you talking singing etc. (Look in the Moments to share section for talking topics). Includes the advanced auto-obituary plan plus video memories, picture stories, audio notes. Highlight your significant moments in past, present & future years.',
      features: [
        'Record up to ten – 3 minute videos per year.',
        'Show up to 30 family pictures w/ audio recorded descriptions.',
      ],
      gradient: 'blue',
    },
    {
      title: 'Ultimate Legacy Creation Plan',
      price: 11,
      membership: 'One Year Membership $132',
      auto: 'Automatic Renewal',
      description:
        'Includes legacy creation plan plus additional videos, pictures and audio notes.',
      features: [
        'Records an additional 40 – three minute videos per year.',
        'Show an additional 60 pictures with audio notes.',
      ],
      gradient: 'yellow',
    },
  ];

  ngOnInit() {
    this.initScrollAnimation();
  }

  private initScrollAnimation() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    setTimeout(() => {
      document
        .querySelectorAll('.legacy-cards-section, .plan-cards-section')
        .forEach((section) => observer.observe(section));
    }, 100);
  }

  openMomentsModal() {
    this.showMomentsModal = true;
  }

  closeMomentsModal() {
    this.showMomentsModal = false;
  }
  scrollToTop() {
    this.soundService.playClickSound();
    // window.scrollTo({ top: 0, behavior: 'smooth' });
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
  handleMomentsToShareClick(event: Event) {
    this.soundService.playClickSound();
    this.showMomentsModal = true;
    event.preventDefault();
    // Your specific logic for Moments to Share
  }

  handleDefaultLearnMore(event: Event) {
    this.soundService.playClickSound();
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
