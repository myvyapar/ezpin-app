import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-physical',
  templateUrl: './physical.component.html',
  styleUrls: ['./physical.component.scss']
})
export class PhysicalComponent implements OnInit {
  isSingleComponent: boolean = true;
  showTab: boolean = true;
  selectedTab;

  constructor() { }

  ngOnInit(): void {
  }

  changeTabSelect($event) {
    if ($event.tab.textLabel === 'Bulk') {
      this.isSingleComponent = false
    } else {
      this.isSingleComponent = true
    }
  }

  onShowTab(showTab) {
    this.showTab = showTab;
    if (showTab) {
      this.selectedTab = 1;
    }
  }
}
