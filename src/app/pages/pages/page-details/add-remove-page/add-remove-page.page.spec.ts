import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddRemovePagePage } from './add-remove-page.page';

describe('AddRemovePagePage', () => {
  let component: AddRemovePagePage;
  let fixture: ComponentFixture<AddRemovePagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRemovePagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddRemovePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
