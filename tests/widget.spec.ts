import { test, expect } from '@playwright/test';
import { WidgetPage } from "./widget.page";

test.describe('Uchi.ru widget ', () => {
  let widgetPage: WidgetPage;

  // -------------------------------------------------
  // Подготовка: открытие страницы и закрытие баннера cookies
  // -------------------------------------------------
  test.beforeEach(async ({ page }) => {
    widgetPage = new WidgetPage(page);

    // open uchi.ru main page
    await page.goto('/');

    // close cookies popup
    await page.click('._UCHI_COOKIE__button');
  });

  /**--------------------------------------------------------
   * Тест: Виджет поддержки открывается при клике на кнопку
   *
   * Проверка, что после клика на иконку виджета появляется iframe с телом виджета
   ---------------------------------------------------------*/

  test('opens', async ({ page }) => {
    await widgetPage.openWidget();

    await expect(widgetPage.getWidgetBody()).toBeVisible();
  });

  /**------------------------------------------------------------- 
   * Тест: Форма обращения в поддержку имеет корректный заголовок
   * 
   * Открытие виджета → клик по первой популярной статье →
   * → нажатие «Написать нам» → проверка заголовка формы
   --------------------------------------------------------------*/

  test('has correct title', async ({ page }) => {
    await widgetPage.openWidget();

    const articles = widgetPage.getPopularArticles(); // Исправление:реализована работа с Locator напрямую, чтобы избежать undefined при раннем чтении массива через .all().
    await expect(articles.first()).toBeVisible();
    await articles.first().click();

    await widgetPage.clickWriteToUs();

    await expect(widgetPage.getTitle()).toHaveText('Связь с поддержкой'); // Исправление: toHaveText автоматически ожидает нужный текст и уменьшает флаки по сравнению с ручным textContent().
  });



  /**---------------------------------------------------------------------
   * Дополнительный тест
   * Тест: Поле поиска в виджете принимает ввод и возвращает результаты
   * 
   * Открытие виджета → ввод текста в поиск → проверка наличия результатов
   ----------------------------------------------------------------------*/

  test('search returns results', async ({ page }) => {
    //Открыть виджет поддержки
    await widgetPage.openWidget(); 

    //Определить текст для поиска
    const searchText = 'оплата';

    //Выполнить поиск по введенному тексту нажатием на Enter
    await widgetPage.search(searchText);

    //Получить локатор для результатов поиска
    const results = widgetPage.getSearchResults();

    //Проверить, что хотя бы один результат поиска виден
    await expect(results.first()).toBeVisible();
    
    //Проверить, что количество найденных результатов больше нуля
    const count = await results.count();
    expect(count).toBeGreaterThan(0);
  });
  
});