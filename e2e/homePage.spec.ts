import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
	test('shows app title and add student button', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { name: 'Tap Track' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Add Student' })).toBeVisible();
	});

	test('can create a student and see them on the home page', async ({ page }) => {
		await page.goto('/create');

		await page.getByLabel('First Name').fill('John');
		await page.getByLabel('Last Name').fill('Doe');
		await page.getByRole('button', { name: 'Create' }).click();

		await expect(page).toHaveURL('/');
		await expect(page.getByText('John Doe')).toBeVisible();
	});

	test('can navigate to student profile', async ({ page }) => {
		await page.goto('/');

		const studentLink = page.getByRole('link', { name: /John Doe/ });
		if (await studentLink.isVisible()) {
			await studentLink.click();
			await expect(page.getByRole('heading', { name: 'John Doe' })).toBeVisible();
			await expect(page.getByRole('link', { name: 'Add Behavior' })).toBeVisible();
		}
	});
});
