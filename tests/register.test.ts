import db from '@/lib/db'
import { test, expect } from '@playwright/test'

test('has title', async ({ page }) => {
  await page.goto('/register')
  await expect(page).toHaveTitle('Create your account')
})

const generateRandomEmail = () => {
  const randomString = Math.random().toString(36).substring(2, 11)
  return `${randomString}@example.com`
}

test('successful sign up', async ({ page }) => {
  await page.goto('/register')

  const email = generateRandomEmail()

  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Full Name').fill('Demo User')
  await page.getByLabel('Password').fill('secretpassword')
  await page.getByRole('button', { name: 'Create account' }).click()

  await page.waitForURL('/verify-email')

  await expect(page.locator('text=Click on the link we sent to')).toBeVisible()
})

test('shows error message when email is already taken', async ({ page }) => {
  await page.goto('/register')

  const user = await db.query.users.findFirst()
  if (user) {
    await page.getByLabel('Email').fill(user.email)
    await page.getByLabel('Full Name').fill('Demo User')
    await page.getByLabel('Password').fill('secretpassword')
    await page.getByRole('button', { name: 'Create account' }).click()
    await expect(
      page.getByText('An account with this email already exists.'),
    ).toBeVisible()
  }
})

test('shows error message when password is less than 8 characters', async ({
  page,
}) => {
  await page.goto('/register')

  await page.getByLabel('Email').fill(generateRandomEmail())
  await page.getByLabel('Full Name').fill('Demo User')
  await page.getByLabel('Password').fill('sec')
  await page.getByRole('button', { name: 'Create account' }).click()
  await expect(
    page.getByText('Password must be at least 8 characters'),
  ).toBeVisible()
})
