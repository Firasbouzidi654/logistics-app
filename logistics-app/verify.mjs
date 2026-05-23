import { chromium } from 'playwright'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const SHOTS = path.join(__dirname, 'screenshots')

import fs from 'fs'
fs.mkdirSync(SHOTS, { recursive: true })

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage()
await page.setViewportSize({ width: 1440, height: 900 })

const BASE = 'http://localhost:5173'
const log = (msg) => console.log(msg)

// ── 1. Homepage hero ────────────────────────────────────────────────
log('\n▶ 1. Loading homepage...')
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(1200) // let counters animate

const title = await page.title()
log(`   Title: ${title}`)

const heroText = await page.locator('h1').first().innerText()
log(`   H1: ${heroText.replace(/\n/g,' ')}`)

// KPI counter values
const kpiValues = await page.locator('.gradient-text').allInnerTexts()
log(`   KPI counters: ${kpiValues.join(' | ')}`)

await page.screenshot({ path: `${SHOTS}/01-homepage-hero.png`, fullPage: false })
log('   📸 screenshots/01-homepage-hero.png')

// ── 2. Scroll to Zielkonflikt ──────────────────────────────────────
log('\n▶ 2. Checking Zielkonflikt section...')
await page.evaluate(() => window.scrollBy(0, window.innerHeight))
await page.waitForTimeout(800)
const konfliktTitle = await page.locator('h2').filter({ hasText: 'Zielkonflikt' }).first().innerText()
log(`   Section title: "${konfliktTitle}"`)
const vsBox = await page.locator('div:text-is("VS")').isVisible()
log(`   VS indicator visible: ${vsBox}`)
await page.screenshot({ path: `${SHOTS}/02-zielkonflikt.png` })
log('   📸 screenshots/02-zielkonflikt.png')

// ── 3. Module cards ───────────────────────────────────────────────
log('\n▶ 3. Checking module cards...')
await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.65))
await page.waitForTimeout(600)
const cardTitles = await page.locator('#modules h3').allInnerTexts()
log(`   Cards: ${cardTitles.join(' | ')}`)
await page.screenshot({ path: `${SHOTS}/03-module-cards.png` })
log('   📸 screenshots/03-module-cards.png')

// ── 4. Navigate to ABC/XYZ ────────────────────────────────────────
log('\n▶ 4. Navigating to /abc-xyz...')
await page.goto(`${BASE}/abc-xyz`, { waitUntil: 'networkidle' })
await page.waitForTimeout(1000)

const abcTitle = await page.locator('h1').first().innerText()
log(`   Page title: "${abcTitle}"`)
await page.screenshot({ path: `${SHOTS}/04-abcxyz-page.png` })
log('   📸 screenshots/04-abcxyz-page.png')

// ── 5. Pareto chart renders ────────────────────────────────────────
log('\n▶ 5. Checking Pareto chart...')
await page.waitForSelector('canvas', { timeout: 5000 })
const canvasVisible = await page.locator('canvas').isVisible()
log(`   Canvas visible: ${canvasVisible}`)
const canvasBox = await page.locator('canvas').boundingBox()
log(`   Canvas size: ${canvasBox?.width?.toFixed(0)}×${canvasBox?.height?.toFixed(0)}`)
await page.screenshot({ path: `${SHOTS}/05-pareto-chart.png` })
log('   📸 screenshots/05-pareto-chart.png')

// ── 6. Product table editable ─────────────────────────────────────
log('\n▶ 6. Testing editable product table...')
const inputs = await page.locator('input[type="number"]').count()
log(`   Number inputs found: ${inputs}`)

// Read first price input value
const firstPrice = await page.locator('input[type="number"]').first().inputValue()
log(`   First price input value: ${firstPrice}`)

// Change the first price and wait for chart update
const firstInput = page.locator('input[type="number"]').first()
await firstInput.triple_click?.() || await firstInput.click({ clickCount: 3 })
await firstInput.fill('99999')
await firstInput.press('Tab')
await page.waitForTimeout(600)

// Check the total value text updated
const totalValEl = await page.locator('text=Gesamtwert').first().isVisible()
log(`   Gesamtwert label visible: ${totalValEl}`)

await page.screenshot({ path: `${SHOTS}/06-table-edit.png` })
log('   📸 screenshots/06-table-edit.png')

// ── 7. Theorie tab ────────────────────────────────────────────────
log('\n▶ 7. Testing Theorie tab...')
await page.locator('button', { hasText: 'Theorie' }).click()
await page.waitForTimeout(400)
const introVisible = await page.locator('text=Was ist die ABC-Analyse').isVisible()
log(`   ABCIntro visible: ${introVisible}`)
await page.screenshot({ path: `${SHOTS}/07-theorie-tab.png` })
log('   📸 screenshots/07-theorie-tab.png')

// ── 8. Mobile responsive ──────────────────────────────────────────
log('\n▶ 8. Mobile view check...')
await page.setViewportSize({ width: 390, height: 844 })
await page.goto(BASE, { waitUntil: 'networkidle' })
await page.waitForTimeout(600)
const hamburger = await page.locator('button.md\\:hidden').isVisible()
log(`   Hamburger menu visible on mobile: ${hamburger}`)
await page.screenshot({ path: `${SHOTS}/08-mobile-home.png` })
log('   📸 screenshots/08-mobile-home.png')

await browser.close()
log('\n✅ All screenshots saved to screenshots/')
