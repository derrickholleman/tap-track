import { test, expect, Page } from '@playwright/test';

const seedStudents = [
	{ id: 'student-1', firstName: 'Alice', lastName: 'Johnson', behaviors: [] },
	{ id: 'student-2', firstName: 'Marcus', lastName: 'Rivera', behaviors: [] },
];

async function seedLocalStorage(page: Page) {
	await page.addInitScript((students) => {
		localStorage.setItem('taptrack_students', JSON.stringify(students));
	}, seedStudents);
}

test.describe('Home Page', () => {
	test('shows app title and add student button', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByRole('heading', { name: 'Tap Track' })).toBeVisible();
		await expect(page.getByRole('link', { name: 'Add Student' })).toBeVisible();
	});

	test('shows empty state when no students exist', async ({ page }) => {
		await page.goto('/');

		await expect(page.getByText('No students found.')).toBeVisible();
	});

	test('displays seeded students', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/');

		await expect(page.getByText('Alice Johnson')).toBeVisible();
		await expect(page.getByText('Marcus Rivera')).toBeVisible();
	});

	test('filters students by name', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/');

		await page.getByPlaceholder('Search students...').fill('alice');

		await expect(page.getByText('Alice Johnson')).toBeVisible();
		await expect(page.getByText('Marcus Rivera')).not.toBeVisible();
	});

	test('can delete a student from the home page', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/');

		await page.getByRole('button', { name: 'Delete Alice Johnson' }).click();

		await expect(page.getByRole('dialog')).toBeVisible();
		await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

		await expect(page.getByText('Student deleted successfully')).toBeVisible();
		await expect(page.getByText('Alice Johnson')).not.toBeVisible();
		await expect(page.getByText('Marcus Rivera')).toBeVisible();
	});

	test('displays students sorted alphabetically by last name', async ({ page }) => {
		const unsortedStudents = [
			{ id: 's-1', firstName: 'Zara', lastName: 'Williams', behaviors: [] },
			{ id: 's-2', firstName: 'Alice', lastName: 'Brown', behaviors: [] },
			{ id: 's-3', firstName: 'Marcus', lastName: 'Rivera', behaviors: [] },
		];
		await page.addInitScript((students) => {
			localStorage.setItem('taptrack_students', JSON.stringify(students));
		}, unsortedStudents);
		await page.goto('/');

		const names = await page.getByRole('link', { name: /Brown|Rivera|Williams/ }).allTextContents();
		expect(names).toEqual(['Alice Brown', 'Marcus Rivera', 'Zara Williams']);
	});

	test('student name links to profile page', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/');

		await page.getByRole('link', { name: 'Alice Johnson' }).click();

		await expect(page.getByRole('heading', { name: 'Alice Johnson' })).toBeVisible();
	});
});
