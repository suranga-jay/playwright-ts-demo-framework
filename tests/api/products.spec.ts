import { test, expect } from '@playwright/test';

test.describe('Products API', () => {

  test('GET all products returns 200', async ({ request }) => {
    const response = await request.get('/api/productsList');
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
  });

  test('POST to search product returns results', async ({ request }) => {
    const response = await request.post('/api/searchProduct', {
      form: { search_product: 'top' },
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
  });

});