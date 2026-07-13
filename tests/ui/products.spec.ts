import { test, expect } from '../../fixtures/base';

test.describe('Products', () => {

  test('should display products list', async ({ productsPage }) => {
    await productsPage.goto();
    const count = await productsPage.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('should search for a product', async ({ productsPage }) => {
    await productsPage.goto();
    await productsPage.searchProduct('T-Shirt');
    await expect(productsPage.searchResults.first()).toBeVisible();
  });

});