import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-empty',
  templateUrl: './empty.page.html',
  styleUrls: ['./empty.page.scss'],
})
export class EmptyPage implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  async ngOnInit() {
    const member = await this.authService.hasClaim(0);
    if (member) {
      this.router.navigateByUrl('/dashboard');
    }
  }

}
