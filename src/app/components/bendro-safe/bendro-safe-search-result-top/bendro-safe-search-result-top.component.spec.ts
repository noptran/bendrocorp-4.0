import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { BendroSafeSearchResultTopComponent } from './bendro-safe-search-result-top.component';

describe('BendroSafeSearchResultTopComponent', () => {
  let component: BendroSafeSearchResultTopComponent;
  let fixture: ComponentFixture<BendroSafeSearchResultTopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BendroSafeSearchResultTopComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(BendroSafeSearchResultTopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
