import {Component} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';

@Component({
  moduleId: module.id,
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  isDashboard = true;
  isCohortSelection = false;
  isAnalysis = false;
  isExport = false;

  constructor(private router: Router) {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let whichStep = event.urlAfterRedirects.split('/')[1];
        this.updateNavbar(whichStep);
      }
    });
  }

  updateNavbar(whichStep: string) {
    this.isDashboard = (whichStep === 'dashboard');
    this.isCohortSelection = (whichStep === 'cohort-selection');
    this.isAnalysis = (whichStep === 'analysis');
    this.isExport = (whichStep === 'export');

    // console.log('-- which step: ', whichStep);
    // console.log('isDashboard: ', this.isDashboard);
    // console.log('isCohortSelection: ', this.isCohortSelection);
    // console.log('isAnalysis: ', this.isAnalysis);
    // console.log('isExport: ', this.isExport);
  }

}
