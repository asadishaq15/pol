// src/app/pages/auto-obituary/auto-obituary.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeroComponent } from '../../components/hero/hero.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { CtaComponent } from '../../components/cta/cta.component';
import { fadeInOnScroll } from '../../services/animations';
import { SoundService } from 'src/app/services/sound.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auto-obituary',
  // standalone: true,
  // imports: [CommonModule, FormsModule, HeroComponent, ButtonComponent, CtaComponent],
  templateUrl: './auto-obituary.component.html',
  styleUrls: ['./auto-obituary.component.scss'],
  // animations: [fadeInOnScroll],
})
export class AutoObituaryComponent implements OnInit {
  constructor(private soundService: SoundService, private router: Router) {}
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
        .querySelectorAll('.card-section, .plan-section, .upgrade-section')
        .forEach((section) => observer.observe(section));
    }, 100);
  }
  scrollToTop() {
    this.soundService.playClickSound();
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
  goToPage() {
    this.soundService.playClickSound();
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.router.navigate(['/subscription-plans']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }
}
