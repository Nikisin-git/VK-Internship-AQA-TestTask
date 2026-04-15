import { Page, expect } from "@playwright/test";

enum WidgetPageSelectors {
    WRAPPER = '.sc-dino-typography-h > [class^=widget__]',
    WIDGET_BODY = '[class^=widgetWrapper] > [class^=widget__]',
    HEADER_TEXT = 'header h5',
    BUTTON_OPEN = '[data-test=openWidget]',
    //BUTTON_WRITE_TO_US = '[class^=btn]',
    BUTTON_WRITE_TO_US = '[data-test=button_feedback_form]', //Исправление: используется уникальный data-test вместо общего class-селектора, чтобы strict mode всегда находил ровно 1 элемент
    ARTICLE_POPULAR_TITLE = '[class^=popularTitle__]',
    ARTICLE_POPULAR_LIST = `${ARTICLE_POPULAR_TITLE} + ul[class^=articles__]`,
    ARTICLE_POPULAR_LIST_ITEM = `${ARTICLE_POPULAR_LIST} > li`,
    //Селекторы для работы дополнительного теста
    SEARCH_INPUT = 'input[type="text"]', // Селектор для поля ввода поискового запроса в виджете
    SEARCH_RESULT_ITEM = '[class^=article__]', // Селектор для элементов результатов поиска (статей) в виджете

}

export class WidgetPage {
    static selector = WidgetPageSelectors;

    constructor(protected page: Page) {}

    wrapper() {
        return this.page.locator(WidgetPage.selector.WRAPPER)
    }

    async openWidget() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_OPEN).click();
    }

    getPopularArticles() {
        //return this.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST_ITEM).all()
         return this.wrapper().locator(WidgetPage.selector.ARTICLE_POPULAR_LIST_ITEM); //Исправление: возвращается Locator, а не .all()
    }



    async clickWriteToUs() {
        return this.wrapper().locator(WidgetPage.selector.BUTTON_WRITE_TO_US).click();
    }

    getTitle() {
        return this.wrapper().locator(WidgetPage.selector.HEADER_TEXT);//Исправление:возвращается Locator для последующей проверки через expect(...).toHaveText(). Это стабильнее, чем textContent().
    }

    getWidgetBody() {
        return this.page.locator(WidgetPage.selector.WIDGET_BODY);
    }

    //-------------------------------------
    //Методы для дополнительного теста
    //-------------------------------------
    async search(text: string) 
    {
        const input = this.wrapper().locator(WidgetPage.selector.SEARCH_INPUT);
        await input.fill(text);
        await input.press('Enter');
    }

    getSearchResults() 
    {
        return this.wrapper().locator(WidgetPage.selector.SEARCH_RESULT_ITEM);
    }
}

