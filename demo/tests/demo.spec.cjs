const { test, expect } = require("../../e2e/node_modules/@playwright/test");

test("creates, edits, persists, and resets a private demo timesheet", async ({
    page,
    browser,
}) => {
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/");
    await expect(page).toHaveTitle("Worklog");
    await page.locator("#region").selectOption({ label: "Berlin" });
    await page.locator("#year").selectOption("2026");
    await page.getByRole("button", { name: "Create timesheet" }).click();
    await expect(page.getByRole("link").filter({ hasText: "Berlin" })).toBeVisible();
    await page.locator("#region").selectOption({ label: "Berlin" });
    await page.locator("#year").selectOption("2026");
    await page.getByRole("button", { name: "Create timesheet" }).click();
    await expect(page.getByRole("alert")).toContainText(
        "already has a timesheet",
    );
    await page.getByRole("link").filter({ hasText: "Berlin" }).click();
    await expect(page.getByTestId("day-2026-01-01")).toContainText("Neujahr");
    await expect(page.getByTestId("day-2026-01-01")).toBeDisabled();
    await expect(page.getByTestId("day-2026-01-03")).toBeDisabled();
    for (const date of ["05", "06"])
        await page.getByTestId(`day-2026-01-${date}`).click();
    await page.getByRole("button", { name: "Edit selected" }).click();
    await page.getByRole("spinbutton", { name: "Hours" }).fill("11");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByText("Enter 0 to 10 hours")).toBeVisible();
    await page.getByRole("spinbutton", { name: "Hours" }).fill("8");
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByRole("dialog")).toBeHidden();
    await page.reload();
    for (const date of ["05", "06"])
        await expect(page.getByTestId(`day-2026-01-${date}`)).toContainText(
            "8 h",
        );
    await page.getByTestId("day-2026-01-05").click();
    await page.getByRole("button", { name: "Edit selected" }).click();
    await page.getByRole("radio", { name: "Vacation" }).check();
    await page.getByRole("button", { name: "Save", exact: true }).click();
    await expect(page.getByTestId("day-2026-01-05")).toContainText("Vacation");
    await expect(page.getByTestId("day-2026-01-05")).not.toContainText("8 h");
    const isolated = await browser.newPage();
    await isolated.goto(new URL("/", page.url()).href);
    await expect(
        isolated.getByText(
            "No timesheets yet. Pick a year and a region above to create one.",
        ),
    ).toBeVisible();
    await isolated.close();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(
        await page.evaluate(
            () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
    ).toBe(true);
    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Reset demo" }).click();
    await expect(
        page.getByText(
            "No timesheets yet. Pick a year and a region above to create one.",
        ),
    ).toBeVisible();
    expect(errors).toEqual([]);
});
