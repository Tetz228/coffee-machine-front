import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {Coffee} from "../../models/coffee";
import {debounceTime, distinctUntilChanged, startWith, Subject, tap} from "rxjs";
import {CoffeesService} from "../../services/coffees.service";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-coffees',
  templateUrl: './coffees.component.html',
  styleUrls: ['./coffees.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

/**
 * Компонент кофе.
 */
export class CoffeesComponent implements OnInit {
  /**
   * Выбранный кофе.
   */
  selectCoffee: Coffee;

  /**
   * Элемент ввода для поиска.
   */
  findControl: FormControl;

  /**
   * Перечисление видов кофе.
   */
  subjectCoffees: Subject<Coffee[]>;

  /**
   * Номер текущей страницы.
   */
  currentNumberPage: number = 1;

  /**
   * Общее количество кофе.
   */
  totalCountCoffees: number;

  /**
   * Поисковый фильтр.
   */
  searchFilter: string = "";

  /**
   * Количество кофе на странице.
   */
  countCoffeesPage: number;

  /**
   * Задержка перед поиском кофе.
   */
  debounceTimeCoffees: number;

  /**
   * Компонент кофе.
   * @param coffeesService - Сервис для работы с кофе.
   */
  constructor(private coffeesService: CoffeesService) {
  }

  /**
   * Инициализация компонента.
   */
  ngOnInit(): void {
    this.findControl = new FormControl();
    this.subjectCoffees = new Subject<Coffee[]>();
    this.debounceTimeCoffees = this.coffeesService.DebounceTimeCoffees;
    this.countCoffeesPage = this.coffeesService.CountCoffeesPage;

    this.findControl.valueChanges.pipe(
      startWith(''),
      debounceTime(800),
      distinctUntilChanged())
      .subscribe(value => {
        this.searchFilter = value;
        this.currentNumberPage = 1;
        this.getCoffeesParameters();
      });

    this.getCoffeesParameters();
  }

  /**
   * Получение новой страницы.
   * @param currentNumberPage - Текущий номер страницы.
   */
  getPage(currentNumberPage: number) {
    this.currentNumberPage = currentNumberPage;

    this.getCoffeesParameters();
  }

  /**
   * Получение параметров видов кофе.
   */
  getCoffeesParameters() {
    this.coffeesService.getCoffeesParameters(this.searchFilter, this.currentNumberPage, this.countCoffeesPage)
      .pipe(tap(itemsParameters => this.totalCountCoffees = itemsParameters.totalCountItems))
      .subscribe(value => this.subjectCoffees.next(value.items));
  }

  /**
   * Очистка элемента ввода для поиска.
   */
  clearFindControl() {
    this.findControl.setValue("");
  }
}
