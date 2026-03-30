import { test, expect, Page } from '@playwright/test';

const seedStudents = [
	{
		id: 'student-1',
		firstName: 'Alice',
		lastName: 'Johnson',
		behaviors: [{ id: 'behavior-1', type: 'Off task', timestamp: 1751000100000 }],
	},
];

async function seedLocalStorage(page: Page) {
	await page.addInitScript((students) => {
		localStorage.setItem('taptrack_students', JSON.stringify(students));
	}, seedStudents);
}

test.describe('Add Behavior', () => {
	test('navigates to add behavior page from profile', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/profile');

		await page.getByRole('link', { name: 'Add Behavior' }).click();

		await expect(page).toHaveURL('/student-1/behavior/add');
		await expect(page.getByRole('heading', { name: 'Add Behavior' })).toBeVisible();
	});

	test('date is auto-populated with today', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/behavior/add');

		const dateInput = page.getByLabel('Date');
		const today = new Date();
		const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

		await expect(dateInput).toHaveValue(expected);
	});

	test('apply button is disabled until all fields are filled', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/behavior/add');

		const applyButton = page.getByRole('button', { name: 'Apply' });

		await expect(applyButton).toBeDisabled();

		await page.getByLabel('Behavior').selectOption('Off task');
		await expect(applyButton).toBeDisabled();

		await page.getByLabel('Time').fill('09:15');
		await expect(applyButton).toBeEnabled();
	});

	test('creates a behavior and returns to profile', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/behavior/add');

		await page.getByLabel('Behavior').selectOption('Refusing work');
		await page.getByLabel('Time').fill('10:30');
		await page.getByRole('button', { name: 'Apply' }).click();

		await expect(page).toHaveURL('/student-1/profile');
		await expect(page.getByText('Refusing work')).toBeVisible();
	});
});

test.describe('Edit Behavior', () => {
	test('navigates to edit page from profile', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/profile');

		await page.getByRole('link', { name: 'Edit' }).click();

		await expect(page).toHaveURL('/student-1/behavior/behavior-1/edit');
		await expect(page.getByRole('heading', { name: 'Edit Behavior' })).toBeVisible();
	});

	test('form is pre-filled with existing behavior data', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/behavior/behavior-1/edit');

		await expect(page.getByLabel('Behavior')).toHaveValue('Off task');
		await expect(page.getByLabel('Time')).not.toHaveValue('');
	});

	test('updates behavior and returns to profile', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/behavior/behavior-1/edit');

		await page.getByLabel('Behavior').selectOption('Interrupting');
		await page.getByRole('button', { name: 'Apply' }).click();

		await expect(page).toHaveURL('/student-1/profile');
		await expect(page.getByText('Interrupting')).toBeVisible();
	});
});
