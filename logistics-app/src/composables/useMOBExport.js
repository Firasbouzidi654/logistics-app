/**
 * useMOBExport.js
 * Export Make-or-Buy data → CSV · Excel · PDF
 */
import { useMakeOrBuyStore } from '../stores/makeorbuy'

function fmt(n) {
  return new Intl.NumberFormat('de-DE').format(Math.round(n))
}

function triggerDownload(filename, mime, content) {
  const blob = new Blob([content], { type: mime })
  const url  = URL.createObjectURL(blob)
  const a    = Object.assign(document.createElement('a'), { href: url, download: filename })
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/* ── CSV ──────────────────────────────────────────────────────── */
export function exportMOBCSV() {
  const s = useMakeOrBuyStore()
  const rows = [
    ['Make-or-Buy Analyse — LogiTech Fertigungs GmbH'],
    ['Produkt: Elektrische Antriebseinheit EA-300 | Lieferant: Siemens AG'],
    [`Erstellt: ${new Date().toLocaleDateString('de-DE')}`],
    [],
    ['── Finanzkennzahlen ──'],
    ['Position', 'Make', 'Buy'],
    ['Fixkosten (€)',            fmt(s.params.fixedCosts),             '0'],
    ['Material/Stk (€)',         fmt(s.params.materialCostPerUnit),    '—'],
    ['Arbeit/Stk (€)',           fmt(s.params.laborCostPerUnit),       '—'],
    ['Maschine/Stk (€)',         fmt(s.params.machineCostPerUnit),     '—'],
    ['Lieferantenpreis/Stk (€)', '—',                                  fmt(s.params.supplierPrice)],
    ['Variable Kosten/Stk (€)',  fmt(s.variableCostPerUnit),           fmt(s.params.supplierPrice)],
    ['Menge/Jahr (Stk)',         fmt(s.params.quantity),               fmt(s.params.quantity)],
    ['Gesamtkosten (€)',         fmt(s.makeTotalCost),                 fmt(s.buyTotalCost)],
    ['Differenz (€)',            fmt(Math.abs(s.costDiff)),            s.costDiff >= 0 ? 'Make günstiger' : 'Buy günstiger'],
    ['Break-even (Stk/Jahr)',    s.breakEvenQty ? fmt(s.breakEvenQty) : '∞', '—'],
    [],
    ['── Nutzwertanalyse ──'],
    ['Kriterium', 'Gewichtung %', 'Score Make', 'Score Buy', 'Gew. Make', 'Gew. Buy'],
    ...s.criteria.map(c => [
      c.label,
      c.weight + '%',
      c.makeScore,
      c.buyScore,
      ((c.makeScore * c.weight) / s.totalWeight).toFixed(2),
      ((c.buyScore  * c.weight) / s.totalWeight).toFixed(2),
    ]),
    [],
    ['Gesamtscore Make', s.weightedMakeScore, '', 'Gesamtscore Buy', s.weightedBuyScore],
    ['Empfehlung (Gesamt)', s.overallRecommendation.toUpperCase()],
  ]
  const csv = rows.map(r => r.map(c => `"${c}"`).join(';')).join('\r\n')
  triggerDownload('make_or_buy_analyse.csv', 'text/csv;charset=utf-8;', '﻿' + csv)
}

/* ── Excel ────────────────────────────────────────────────────── */
export async function exportMOBExcel() {
  const s    = useMakeOrBuyStore()
  const XLSX = (await import('xlsx')).default ?? (await import('xlsx'))

  // Sheet 1: Kosten
  const kostenData = [
    ['Make-or-Buy Analyse — LogiTech Fertigungs GmbH'],
    ['Produkt: Elektrische Antriebseinheit EA-300'],
    [`Erstellt: ${new Date().toLocaleDateString('de-DE')}`],
    [],
    ['Position', 'Make (€)', 'Buy (€)'],
    ['Fixkosten',            s.params.fixedCosts,        0],
    ['Materialkosten',       s.params.materialCostPerUnit * s.params.quantity, 0],
    ['Arbeitskosten',        s.params.laborCostPerUnit   * s.params.quantity, 0],
    ['Maschinenkosten',      s.params.machineCostPerUnit * s.params.quantity, 0],
    ['Lieferantenkosten',    0,                          s.buyTotalCost],
    ['GESAMT',               s.makeTotalCost,             s.buyTotalCost],
    [],
    ['Break-even (Stk/Jahr)', s.breakEvenQty ?? '∞'],
    ['Empfehlung',            s.overallRecommendation === 'make' ? 'MAKE (Eigenfertigung)' : 'BUY (Fremdbezug)'],
  ]

  // Sheet 2: Kriterien
  const kriterienData = [
    ['Nutzwertanalyse — Kriterienbewertung'],
    [],
    ['Kriterium', 'Beschreibung', 'Gewichtung %', 'Score Make', 'Score Buy', 'Gew. Make', 'Gew. Buy'],
    ...s.criteria.map(c => [
      c.label, c.description, c.weight,
      c.makeScore, c.buyScore,
      +((c.makeScore * c.weight) / s.totalWeight).toFixed(2),
      +((c.buyScore  * c.weight) / s.totalWeight).toFixed(2),
    ]),
    [],
    ['Gesamtscore', '', '', s.weightedMakeScore, s.weightedBuyScore],
  ]

  const ws1 = XLSX.utils.aoa_to_sheet(kostenData)
  const ws2 = XLSX.utils.aoa_to_sheet(kriterienData)
  ws1['!cols'] = [{ wch: 22 }, { wch: 16 }, { wch: 16 }]
  ws2['!cols'] = [{ wch: 22 }, { wch: 30 }, { wch: 14 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws1, 'Kostenvergleich')
  XLSX.utils.book_append_sheet(wb, ws2, 'Nutzwertanalyse')
  XLSX.writeFile(wb, 'make_or_buy_analyse.xlsx')
}

/* ── PDF ──────────────────────────────────────────────────────── */
export async function exportMOBPDF() {
  const s = useMakeOrBuyStore()
  const { default: jsPDF }     = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const isMake = s.overallRecommendation !== 'buy'

  // ── Dark header band
  doc.setFillColor(14, 30, 60)
  doc.rect(0, 0, 210, 30, 'F')
  doc.setFontSize(16); doc.setTextColor(255); doc.setFont('helvetica', 'bold')
  doc.text('Make-or-Buy Analyse', 14, 13)
  doc.setFontSize(9); doc.setFont('helvetica', 'normal')
  doc.text('LogiTech Fertigungs GmbH  ·  Elektrische Antriebseinheit EA-300  ·  Lieferant: Siemens AG', 14, 22)
  doc.text(new Date().toLocaleDateString('de-DE'), 196, 22, { align: 'right' })

  // ── Recommendation pill
  const pillColor = isMake ? [16, 185, 129] : [56, 189, 248]
  doc.setFillColor(...pillColor)
  doc.roundedRect(14, 36, 182, 14, 3, 3, 'F')
  doc.setFontSize(12); doc.setTextColor(255); doc.setFont('helvetica', 'bold')
  doc.text(
    isMake ? '✓  Empfehlung: Eigenfertigung (Make)' : '✓  Empfehlung: Fremdbezug (Buy)',
    105, 44.5, { align: 'center' }
  )

  // ── KPI summary table
  autoTable(doc, {
    startY: 56,
    head: [['KPI', 'Make', 'Buy', 'Δ Vorteil']],
    body: [
      ['Gesamtkosten',       `${fmt(s.makeTotalCost)} €`,        `${fmt(s.buyTotalCost)} €`,         `${fmt(Math.abs(s.costDiff))} €`],
      ['Var. Kosten/Stk',    `${fmt(s.variableCostPerUnit)} €`,  `${fmt(s.params.supplierPrice)} €`, `${fmt(Math.abs(s.variableCostPerUnit - s.params.supplierPrice))} €`],
      ['Break-even',         s.breakEvenQty ? `${s.breakEvenQty.toLocaleString('de-DE')} Stk` : '∞', '—', '—'],
      ['Nutzwert-Score',     `${s.weightedMakeScore}/10`,        `${s.weightedBuyScore}/10`,         `Δ ${Math.abs(s.weightedMakeScore - s.weightedBuyScore).toFixed(2)}`],
      ['Lieferantenrisiko',  '—',                                `${s.params.supplierRisk}%`,        '—'],
      ['Kap.-Auslastung',    `${s.params.capacityUsage}%`,       '—',                               '—'],
    ],
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: [30, 58, 138], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [247, 249, 255] },
    columnStyles: { 0: { fontStyle: 'bold' }, 3: { textColor: [16, 185, 129], fontStyle: 'bold' } },
  })

  // ── Criteria table
  doc.setFontSize(11); doc.setTextColor(30, 30, 60); doc.setFont('helvetica', 'bold')
  doc.text('Nutzwertanalyse — Kriterienbewertung', 14, doc.lastAutoTable.finalY + 12)

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 16,
    head: [['Kriterium', 'Gewichtung', 'Score Make', 'Score Buy', 'Gew. Make', 'Gew. Buy']],
    body: s.criteria.map(c => [
      c.label,
      c.weight + '%',
      c.makeScore + '/10',
      c.buyScore  + '/10',
      ((c.makeScore * c.weight) / s.totalWeight).toFixed(2),
      ((c.buyScore  * c.weight) / s.totalWeight).toFixed(2),
    ]),
    foot: [['Gesamtscore', '100%', `${s.weightedMakeScore}`, `${s.weightedBuyScore}`,
            `${s.weightedMakeScore}`, `${s.weightedBuyScore}`]],
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [30, 58, 138], textColor: 255 },
    footStyles: { fillColor: [20, 40, 80], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [247, 249, 255] },
    columnStyles: { 1: { halign: 'center' }, 2: { halign: 'center' }, 3: { halign: 'center' }, 4: { halign: 'center' }, 5: { halign: 'center' } },
  })

  // ── Page footer
  const pages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i)
    doc.setFontSize(8); doc.setTextColor(160); doc.setFont('helvetica', 'normal')
    doc.text(`Seite ${i} von ${pages}  |  Make-or-Buy Analyse  |  HTW Berlin`, 105, 292, { align: 'center' })
  }

  doc.save('make_or_buy_analyse.pdf')
}
