import { test, expect, Page } from '@playwright/test';

const seedStudents = [
	{
		id: 'student-1',
		firstName: 'Alice',
		lastName: 'Johnson',
		behaviors: [
			{ id: 'behavior-1', type: 'Off task', timestamp: 1751000100000 },
			{ id: 'behavior-2', type: 'Interrupting', timestamp: 1751100200000 },
		],
	},
];

async function seedLocalStorage(page: Page) {
	await page.addInitScript((students) => {
		localStorage.setItem('taptrack_students', JSON.stringify(students));
	}, seedStudents);
}

test.describe('Student Profile', () => {
	test('displays student name and behaviors', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/profile');

		await expect(page.getByRole('heading', { name: 'Alice Johnson' })).toBeVisible();

		// Expand month groups to see behaviors
		const monthButtons = page.getByRole('button', { name: /2025/ });
		for (const btn of await monthButtons.all()) {
			await btn.click();
		}
		await expect(page.getByText('Off task')).toBeVisible();
		await expect(page.getByText('Interrupting')).toBeVisible();
	});

	test('shows empty state when no behaviors', async ({ page }) => {
		await page.addInitScript(() => {
			localStorage.setItem(
				'taptrack_students',
				JSON.stringify([
					{ id: 'student-1', firstName: 'Alice', lastName: 'Johnson', behaviors: [] },
				])
			);
		});
		await page.goto('/student-1/profile');

		await expect(page.getByText('No behaviors recorded yet.')).toBeVisible();
	});

	test('can delete a behavior from the list', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/profile');

		// Expand the month group containing "Off task"
		await page.getByRole('button', { name: /June 2025/ }).click();
		await expect(page.getByText('Off task')).toBeVisible();

		const offTaskItem = page.getByText('Off task').locator('..');
		await offTaskItem.locator('..').getByRole('button', { name: 'Delete' }).first().click();

		await expect(page.getByText('Off task')).not.toBeVisible();
	});

	test('delete student shows confirmation modal', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/profile');

		await page.getByRole('button', { name: 'Delete Student' }).click();

		await expect(page.getByRole('dialog')).toBeVisible();
		await expect(page.getByText('Are you sure you want to delete')).toBeVisible();
	});

	test('confirming delete redirects to home with toast', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/profile');

		await page.getByRole('button', { name: 'Delete Student' }).click();
		await page.getByRole('dialog').getByRole('button', { name: 'Delete' }).click();

		await expect(page).toHaveURL('/');
		await expect(page.getByText('Student deleted successfully')).toBeVisible();
		await expect(page.getByText('Alice Johnson')).not.toBeVisible();
	});

	test('cancelling delete closes modal', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/profile');

		await page.getByRole('button', { name: 'Delete Student' }).click();
		await page.getByRole('button', { name: 'Cancel' }).click();

		await expect(page.getByRole('dialog')).not.toBeVisible();
		await expect(page.getByRole('heading', { name: 'Alice Johnson' })).toBeVisible();
	});
});
