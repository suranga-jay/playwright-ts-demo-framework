import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  readonly productList: Locator;
  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly searchResults: Locator;

  constructor(page: Page) {
    super(page);
    this.productList   = page.locator('.productinfo');
    this.searchInput   = page.locator('#search_product');
    this.searchButton  = page.locator('#submit_search');
    this.searchResults = page.locator('.productinfo h2');
  }

  async goto() {
    await this.navigate('/products');
    await this.waitForPageLoad();
  }

  async searchProduct(name: string) {
    await this.searchInput.fill(name);
    await this.searchButton.click();
    await this.waitForPageLoad();
  }

  async getProductCount(): Promise<number> {
    return this.productList.count();
  }
}
