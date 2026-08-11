import { Component } from '@angular/core';

import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss'],
})
export class NotFoundComponent {
  constructor(private readonly commonService: CommonService) {}

  goToHomePage(): void {
    this.commonService.goToHomePage();
  }
}
