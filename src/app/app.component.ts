import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SharedService } from './services/shared.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  title = 'pearl-of-life-user';
  public toast: Subject<any>;

  constructor(
    private readonly sharedService: SharedService
  ){}

  ngOnInit(): void {
    this.toast = this.sharedService.toaster;
  }

  remove(): void {
    this.sharedService.hideToast();
  }

}
