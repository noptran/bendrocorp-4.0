import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { PasswordSet } from 'src/app/models/password-set.model';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class PasswordComponent implements OnInit {
  @Output() passwordChangeEvent = new EventEmitter<PasswordSet>();
  @Output() validPasswordSet = new EventEmitter<boolean>();
  passwordSet: PasswordSet = {} as PasswordSet;
  meetsComplexity: boolean;

  strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\(\)\^&-_=+\*])(?=.{10,})');
  // tslint:disable-next-line: max-line-length
  // either it contains lower case and upper mixed, lower case with a number, upper case with a number, uppercase with a symbol, lowercase with a symbol
  mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[!@#\$%\(\)\^&-_=+\*]))|((?=.*[a-z])(?=.*[!@#\$%\(\)\^&-_=+\*])))(?=.{8,})');
  upperCaseRegex = /[A-Z]/g;
  lowerCaseRegex = /[a-z]/g;
  symbolRegex = /[!@#\$%\(\)\^&-_=+\*]/g;
  numberRegex = /[0-9]/g;

  // match counters
  numberOfCharacters: number;
  numberOfUppercase: number;
  numberOfLowercase: number;
  numberOfSymbols: number;
  numberOfNumbers: number;

  // Indicator handlers
  indicatorFill: number;
  indicatorClass: string;
  indicatorLength: number;

  constructor() { }

  analyze()
  {
    if (this.passwordSet.password) {
      this.numberOfCharacters = this.passwordSet.password.length;
      this.numberOfLowercase = ((this.passwordSet.password || '').match(this.lowerCaseRegex) || []).length;
      this.numberOfUppercase = ((this.passwordSet.password || '').match(this.upperCaseRegex) || []).length;
      this.numberOfSymbols = ((this.passwordSet.password || '').match(this.symbolRegex) || []).length;
      this.numberOfNumbers = ((this.passwordSet.password || '').match(this.numberRegex) || []).length;

      // test vs the regex
      // great password
      if (this.strongRegex.test(this.passwordSet.password)) {
        this.indicatorClass = 'success';
        this.indicatorLength = 100;
        this.meetsComplexity = true;
        this.validate();
      // ok password
      } else if (this.mediumRegex.test(this.passwordSet.password)) {
        this.indicatorClass = 'warning';
        this.indicatorLength = 50;
        this.meetsComplexity = true;
        this.validate();
      // terrible password - ya you can't use that
      } else {
        this.indicatorClass = 'danger';
        this.indicatorLength = 10;
        this.meetsComplexity = false;
        this.validate();
      }
    } else {
      this.numberOfCharacters = 0;
      this.numberOfLowercase = 0;
      this.numberOfUppercase = 0;
      this.numberOfSymbols = 0;
      this.numberOfNumbers = 0;
      this.indicatorClass = 'danger';
      this.indicatorLength = 1;
      this.meetsComplexity = false;
      this.validate();
    }
  }

  passwordFilled(): boolean {
    if (this.passwordSet.password && this.passwordSet.password_confirmation) {
      return true;
    } else {
      return false;
    }
  }

  passwordMatch(): boolean {
    if ((!this.passwordSet.password || !this.passwordSet.password_confirmation)
    || (this.passwordSet.password === this.passwordSet.password_confirmation)) {
      return true;
    } else {
      return false;
    }
  }

  validate() {
    const passwordSet = this.passwordMatch();
    const passwordFilled = this.passwordFilled();
    this.validPasswordSet.emit(this.meetsComplexity && passwordSet && passwordFilled);
    this.passwordChangeEvent.emit(this.passwordSet);
  }

  onChange()
  {
    this.analyze();
  }

  ngOnInit() {
    this.analyze();
  }
}
