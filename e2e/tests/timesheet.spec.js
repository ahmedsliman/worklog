// @ts-check
const { test, expect } = require('@playwright/test');

test.describe.serial('timesheet', () => {
  /** @type {import('@playwright/test').Page} */
  let page;
  let year = '';
  let yearId = '';

  const yearSelect = () => page.locator('#year');
  const row = () =>
    page
      .getByRole('listitem')
      .filter({ hasText: year })
      .filter({ hasText: 'Berlin' });

  /** @param {number} dayOfMonth */
  const day = (dayOfMonth) =>
    page.getByTestId(`day-${year}-01-${String(dayOfMonth).padStart(2, '0')}`);

  /** @param {number} index */
  const workday = (index) =>
    page
      .locator('section')
      .first()
      .locator('button:not([disabled])')
      .nth(index);

  const firstSaturday = () => {
    const first = new Date(Date.UTC(Number(year), 0, 1)).getUTCDay();
    const saturday = 1 + ((6 - first + 7) % 7);

    return saturday === 1 ? 8 : saturday;
  };

  /** @param {string} hours */
  const editSelected = async (hours) => {
    await page.getByRole('button', { name: 'Edit selected' }).click();
    await page.getByRole('spinbutton', { name: 'Hours' }).fill(hours);
    await page.getByRole('button', { name: 'Save' }).click();
  };

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('https://localhost/');
  });

  test.afterAll(async () => {
    if (yearId) {
      await page.request.delete(`https://localhost/years/${yearId}`, {
        ignoreHTTPSErrors: true,
      });
    }

    await page.close();
  });

  test('creates a timesheet', async () => {
    await expect(page.getByTestId('years-loading')).toHaveCount(0);

    await page.locator('#region').selectOption({ label: 'Berlin' });

    const berlinRows = await page
      .getByRole('listitem')
      .filter({ hasText: 'Berlin' })
      .allInnerTexts();
    const years = await yearSelect()
      .locator('option:not([value=""])')
      .allTextContents();
    year =
      years.find((value) => !berlinRows.some((text) => text.includes(value))) ??
      '';
    expect(year).toBeTruthy();

    await yearSelect().selectOption(year);
    await page.getByRole('button', { name: 'Create timesheet' }).click();

    await expect(row()).toHaveCount(1);
  });

  test('rejects the same year for the same region', async () => {
    await page.locator('#region').selectOption({ label: 'Berlin' });
    await yearSelect().selectOption(year);
    await page.getByRole('button', { name: 'Create timesheet' }).click();

    await expect(
      page.getByText('This region already has a timesheet for that year.'),
    ).toBeVisible();
    await expect(row()).toHaveCount(1);
  });

  test('opens the timesheet', async () => {
    await row().getByRole('link').click();
    await expect(page).toHaveURL(/\/years\/\d+$/);
    yearId = page.url().split('/').pop() ?? '';
    await expect(page.getByRole('heading', { level: 1 })).toContainText(year);

    await expect(day(1)).toBeVisible();
  });

  test('shows weekends and public holidays', async () => {
    await expect(day(1)).toContainText('Neujahr');
    await expect(day(1)).toBeDisabled();
    await expect(day(firstSaturday())).toBeDisabled();
  });

  test('rejects more than 10 hours', async () => {
    await workday(0).click();
    await editSelected('11');
    await expect(page.getByText('Enter 0 to 10 hours')).toBeVisible();
  });

  test('logs a full day', async () => {
    await page.getByRole('spinbutton', { name: 'Hours' }).fill('8');
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(workday(0)).toContainText('8 h');
  });

  test('edits a range of days at once', async () => {
    await workday(1).click();
    await workday(3).click();
    await expect(page.getByText('2 days selected')).toBeVisible();
    await page.getByRole('button', { name: 'Select days in between' }).click();
    await expect(page.getByText('3 days selected')).toBeVisible();
    await page.getByRole('button', { name: 'Edit selected' }).click();
    await expect(page.getByRole('dialog')).toContainText('Edit 3 days');

    await page.getByRole('radio', { name: 'Vacation' }).check();
    await page.getByRole('button', { name: 'Save' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(workday(1)).toContainText('Vacation');
    await expect(workday(3)).toContainText('Vacation');
  });

  test('keeps the data after a reload', async () => {
    await page.reload();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(year);
    await expect(workday(0)).toContainText('8 h');
    await expect(workday(2)).toContainText('Vacation');
  });

  test('clears a vacation day', async () => {
    await workday(1).click();
    await page.getByRole('button', { name: 'Edit selected' }).click();
    await page.getByRole('button', { name: 'Clear entry' }).click();
    await expect(page.getByRole('dialog')).toBeHidden();
    await expect(workday(1)).not.toContainText('Vacation');
  });
});
