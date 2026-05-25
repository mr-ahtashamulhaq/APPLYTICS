/**
 * Applytics browser smoke tests
 * Run: npx playwright test tests/smoke.spec.ts --reporter=list
 */
import { test, expect, Page } from '@playwright/test'

const BASE = 'http://localhost:3000'

// Next.js dev mode always mounts <nextjs-portal> for HMR — NOT an error.
// The actual error overlay renders a dialog inside it.
async function hasRuntimeError(page: Page): Promise<boolean> {
  const errorDialog = page
    .locator('nextjs-portal [data-nextjs-dialog]')
    .or(page.locator('nextjs-portal [role="alertdialog"]'))
    .or(page.locator('[data-nextjs-error]'))
  return (await errorDialog.count()) > 0
}

// Normalize browser hex shorthand: #fff → #ffffff
function normalizeHex(val: string): string {
  val = val.trim().toLowerCase()
  if (/^#[0-9a-f]{3}$/.test(val)) {
    return '#' + val[1] + val[1] + val[2] + val[2] + val[3] + val[3]
  }
  return val
}

test.describe('Applytics Smoke Tests', () => {
  test('Sign-in page — loads without runtime errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    page.on('pageerror', (err) => consoleErrors.push(err.message))

    await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle' })

    await expect(page).toHaveTitle(/Sign In — Applytics/)
    expect(await hasRuntimeError(page)).toBe(false)
    await expect(page.locator('text=Sign in to Applytics')).toBeVisible()
    await expect(page.locator('text=Tailored resumes for every job')).toBeVisible()

    const realErrors = consoleErrors.filter(
      (e) => !e.includes('clerk') && !e.includes('__clerk') &&
             !e.includes('chrome-extension') && !e.includes('favicon')
    )
    expect(realErrors, `Console errors:\n${realErrors.join('\n')}`).toHaveLength(0)
  })

  test('Sign-up page — loads without runtime errors', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => { if (msg.type() === 'error') consoleErrors.push(msg.text()) })
    page.on('pageerror', (err) => consoleErrors.push(err.message))

    await page.goto(`${BASE}/sign-up`, { waitUntil: 'networkidle' })

    await expect(page).toHaveTitle(/Create Account — Applytics/)
    expect(await hasRuntimeError(page)).toBe(false)
    await expect(page.locator('text=Paste any job description')).toBeVisible()
    await expect(page.locator('text=Your resume, tailored in seconds')).toBeVisible()

    const realErrors = consoleErrors.filter(
      (e) => !e.includes('clerk') && !e.includes('__clerk') &&
             !e.includes('chrome-extension') && !e.includes('favicon')
    )
    expect(realErrors, `Console errors:\n${realErrors.join('\n')}`).toHaveLength(0)
  })

  test('/app/dashboard — redirects unauthenticated to sign-in', async ({ page }) => {
    await page.goto(`${BASE}/app/dashboard`, { waitUntil: 'networkidle' })

    expect(page.url()).toContain('/sign-in')
    expect(await hasRuntimeError(page)).toBe(false)
    await expect(page.locator('text=Sign in to Applytics')).toBeVisible()
  })

  test('CSS tokens — brand-red and canvas applied to :root', async ({ page }) => {
    await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle' })

    const brandRed = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--brand-red').trim()
    )
    expect(brandRed).toBe('#de0d12')

    const canvas = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--canvas').trim()
    )
    // Normalize: browser may return #fff instead of #ffffff
    expect(normalizeHex(canvas)).toBe('#ffffff')

    const brandBlack = await page.evaluate(() =>
      getComputedStyle(document.documentElement)
        .getPropertyValue('--brand-black').trim()
    )
    expect(brandBlack).toBe('#0f0f0f')
  })

  test('Sign-in page — dark left panel has brand-black background', async ({ page }) => {
    await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle' })

    // data-testid="dark-panel" set directly on the left branding div
    const darkPanel = page.locator('[data-testid="dark-panel"]')
    await expect(darkPanel).toBeVisible()

    const bg = await darkPanel.evaluate((el) =>
      getComputedStyle(el).backgroundColor
    )
    // var(--brand-black) = #0f0f0f = rgb(15, 15, 15)
    expect(bg).toBe('rgb(15, 15, 15)')
  })


  test('Sign-in page — Geist font applied to body', async ({ page }) => {
    await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle' })

    const fontFamily = await page.evaluate(() =>
      getComputedStyle(document.body).fontFamily
    )
    // Geist is loaded via next/font — variable name __className_* maps to it
    expect(fontFamily.toLowerCase()).toContain('geist')
  })

  test('/app/generate — redirects unauthenticated to sign-in', async ({ page }) => {
    await page.goto(`${BASE}/app/generate`, { waitUntil: 'networkidle' })
    expect(page.url()).toContain('/sign-in')
    expect(await hasRuntimeError(page)).toBe(false)
  })

  test('/app/profile — redirects unauthenticated to sign-in', async ({ page }) => {
    await page.goto(`${BASE}/app/profile`, { waitUntil: 'networkidle' })
    expect(page.url()).toContain('/sign-in')
    expect(await hasRuntimeError(page)).toBe(false)
  })

  test('/app/tracker — redirects unauthenticated to sign-in', async ({ page }) => {
    await page.goto(`${BASE}/app/tracker`, { waitUntil: 'networkidle' })
    expect(page.url()).toContain('/sign-in')
    expect(await hasRuntimeError(page)).toBe(false)
  })
})
