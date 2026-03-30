import { test, expect } from '@playwright/test';

test.describe('Create Student', () => {
	test('navigates to create page from home', async ({ page }) => {
		await page.goto('/');

		await page.getByRole('link', { name: 'Add Student' }).click();

		await expect(page).toHaveURL('/create');
		await expect(page.getByRole('heading', { name: 'Add Student' })).toBeVisible();
	});

	test('create button is disabled until both fields are filled', async ({ page }) => {
		await page.goto('/create');

		const createButton = page.getByRole('button', { name: 'Create' });

		await expect(createButton).toBeDisabled();

		await page.getByLabel('First Name').fill('John');
		await expect(createButton).toBeDisabled();

		await page.getByLabel('Last Name').fill('Doe');
		await expect(createButton).toBeEnabled();
	});

	test('creates a student and redirects to home with toast', async ({ page }) => {
		await page.goto('/create');

		await page.getByLabel('First Name').fill('John');
		await page.getByLabel('Last Name').fill('Doe');
		await page.getByRole('button', { name: 'Create' }).click();

		await expect(page).toHaveURL('/');
		await expect(page.getByText('John Doe')).toBeVisible();
		await expect(page.getByText('Student created successfully')).toBeVisible();
	});

	test('back link returns to home', async ({ page }) => {
		await page.goto('/create');

		await page.getByRole('link', { name: 'Home' }).click();

		await expect(page).toHaveURL('/');
	});
});
