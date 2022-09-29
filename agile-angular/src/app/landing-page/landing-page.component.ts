import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  constructor(public userService: UserService) { }

  ngOnInit(): void {
  }

   login() {
    this.userService.loginWithGoogle();
  }

  loginAnonymously() {
    this.userService.loginAnonymously();
  }
}
