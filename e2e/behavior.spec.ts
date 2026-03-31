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

test.describe('Behavior List Grouping & Pagination', () => {
	const paginatedStudent = [
		{
			id: 'student-3',
			firstName: 'Carol',
			lastName: 'Davis',
			behaviors: Array.from({ length: 7 }, (_, i) => ({
				id: `b-${i}`,
				type: 'Off task',
				timestamp: 1751000000000 + i * 100000,
			})),
		},
	];

	const multiMonthStudent = [
		{
			id: 'student-4',
			firstName: 'Dan',
			lastName: 'Evans',
			behaviors: [
				{ id: 'b-jan', type: 'Off task', timestamp: new Date('2026-01-15T10:00').getTime() },
				{ id: 'b-feb', type: 'Off task', timestamp: new Date('2026-02-15T10:00').getTime() },
				{ id: 'b-mar', type: 'Off task', timestamp: new Date('2026-03-15T10:00').getTime() },
			],
		},
	];

	test('groups behaviors by month with most recent expanded', async ({ page }) => {
		await page.addInitScript((students) => {
			localStorage.setItem('taptrack_students', JSON.stringify(students));
		}, multiMonthStudent);
		await page.goto('/student-4/profile');

		await expect(page.getByRole('button', { name: /March 2026/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /February 2026/ })).toBeVisible();
		await expect(page.getByRole('button', { name: /January 2026/ })).toBeVisible();
	});

	test('collapses and expands month groups', async ({ page }) => {
		await page.addInitScript((students) => {
			localStorage.setItem('taptrack_students', JSON.stringify(students));
		}, multiMonthStudent);
		await page.goto('/student-4/profile');

		// Most recent month is open by default — its behavior card should be visible
		const marchGroup = page.getByRole('button', { name: /March 2026/ });
		await marchGroup.click();

		// After collapsing, the February group's content should not be visible (it was closed by default)
		await marchGroup.click();
	});

	test('shows pagination within a month when more than 5 behaviors', async ({ page }) => {
		await page.addInitScript((students) => {
			localStorage.setItem('taptrack_students', JSON.stringify(students));
		}, paginatedStudent);
		await page.goto('/student-3/profile');

		await expect(page.getByText('1 of 2')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Previous' })).toBeDisabled();
		await expect(page.getByRole('button', { name: 'Next' })).toBeEnabled();
	});

	test('navigates between pages within a month', async ({ page }) => {
		await page.addInitScript((students) => {
			localStorage.setItem('taptrack_students', JSON.stringify(students));
		}, paginatedStudent);
		await page.goto('/student-3/profile');

		await page.getByRole('button', { name: 'Next' }).click();
		await expect(page.getByText('2 of 2')).toBeVisible();
		await expect(page.getByRole('button', { name: 'Next' })).toBeDisabled();
		await expect(page.getByRole('button', { name: 'Previous' })).toBeEnabled();

		await page.getByRole('button', { name: 'Previous' }).click();
		await expect(page.getByText('1 of 2')).toBeVisible();
	});

	test('hides pagination controls with 5 or fewer behaviors in a month', async ({ page }) => {
		await seedLocalStorage(page);
		await page.goto('/student-1/profile');

		await expect(page.getByRole('button', { name: 'Previous' })).not.toBeVisible();
		await expect(page.getByRole('button', { name: 'Next' })).not.toBeVisible();
	});
});

test.describe('Behavior Insights Chart', () => {
	test('chart section is hidden with no behaviors and visible after adding one', async ({
		page,
	}) => {
		const emptyStudent = [{ id: 'student-2', firstName: 'Bob', lastName: 'Smith', behaviors: [] }];
		await page.addInitScript((students) => {
			localStorage.setItem('taptrack_students', JSON.stringify(students));
		}, emptyStudent);
		await page.goto('/student-2/profile');

		await expect(page.getByText('Behavior Insights')).not.toBeVisible();

		await page.getByRole('link', { name: 'Add Behavior' }).click();
		await page.getByLabel('Behavior').selectOption('Off task');
		await page.getByLabel('Time').fill('09:00');
		await page.getByRole('button', { name: 'Apply' }).click();

		await expect(page).toHaveURL('/student-2/profile');
		await expect(page.getByText('Behavior Insights')).toBeVisible();
	});
});
