/**
 * useABCExport.js
 * Export ABC/XYZ data → CSV · Excel · PDF
 */
import { useABCXYZStore } from '../stores/abcxyz'

function fmt(n) {
  return new Intl.NumberFormat('de-DE').format(n)
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
export function exportABCCSV() {
  const store = useABCXYZStore()
  const header = ['Rang', 'Artikel', 'Stückpreis (€)', 'Menge/Jahr',
                  'Verbrauchswert (€)', 'Anteil %', 'Kum. %', 'Klasse']
  const rows = store.enriched.map((p, i) => [
    i + 1, p.name, p.value, p.demand,
    p.totalValue, p.pct.toFixed(2) + '%', p.cumPct.toFixed(2) + '%', p.abc,
  ])
  const csv = [header, ...rows]
    .map(r => r.map(c => `"${c}"`).join(';'))
    .join('\r\n')
  triggerDownload('abc_xyz_analyse.csv', 'text/csv;charset=utf-8;', '﻿' + csv)
}

/* ── Excel ────────────────────────────────────────────────────── */
export async function exportABCExcel() {
  const store = useABCXYZStore()
  const XLSX  = (await import('xlsx')).default ?? (await import('xlsx'))

  const sheetData = [
    ['ABC/XYZ Analyse — HTW Berlin Wirtschaftsingenieurwesen'],
    [`Gesamtwert: ${fmt(store.totalValue)} €  |  Erstellt: ${new Date().toLocaleDateString('de-DE')}`],
    [],
    ['Rang', 'Artikel', 'Stückpreis (€)', 'Menge/Jahr',
     'Verbrauchswert (€)', 'Anteil %', 'Kum. %', 'Klasse'],
    ...store.enriched.map((p, i) => [
      i + 1, p.name, p.value, p.demand,
      p.totalValue,
      p.pct.toFixed(2) + '%',
      p.cumPct.toFixed(2) + '%',
      p.abc,
    ]),
  ]

  const ws = XLSX.utils.aoa_to_sheet(sheetData)

  // Column widths
  ws['!cols'] = [
    { wch: 6 }, { wch: 28 }, { wch: 14 }, { wch: 12 },
    { wch: 18 }, { wch: 10 }, { wch: 10 }, { wch: 8 },
  ]

  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'ABC-XYZ Analyse')
  XLSX.writeFile(wb, 'abc_xyz_analyse.xlsx')
}

/* ── PDF ──────────────────────────────────────────────────────── */
export async function exportABCPDF() {
  const store = useABCXYZStore()
  const { default: jsPDF }    = await import('jspdf')
  const { default: autoTable } = await import('jspdf-autotable')

  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  // ── Header
  doc.setFillColor(14, 30, 60)
  doc.rect(0, 0, 297, 28, 'F')
  doc.setFontSize(17)
  doc.setTextColor(255)
  doc.setFont('helvetica', 'bold')
  doc.text('ABC/XYZ Analyse', 14, 13)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('HTW Berlin · Produktionswirtschaft & Logistik', 14, 21)
  doc.text(`Gesamtwert: ${fmt(store.totalValue)} €  |  ${new Date().toLocaleDateString('de-DE')}`, 297 - 14, 21, { align: 'right' })

  // ── Table
  autoTable(doc, {
    startY: 34,
    head: [['#', 'Artikel', 'Stückpreis', 'Menge/Jahr', 'Verbrauchswert', 'Anteil', 'Kum. %', 'Klasse']],
    body: store.enriched.map((p, i) => [
      i + 1,
      p.name,
      fmt(p.value) + ' €',
      fmt(p.demand) + ' Stk',
      fmt(p.totalValue) + ' €',
      p.pct.toFixed(1) + '%',
      p.cumPct.toFixed(1) + '%',
      p.abc,
    ]),
    styles: { fontSize: 9, cellPadding: 4, textColor: [30, 30, 50] },
    headStyles: {
      fillColor: [14, 165, 233],
      textColor: 255,
      fontStyle: 'bold',
      fontSize: 9,
    },
    alternateRowStyles: { fillColor: [247, 249, 255] },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right', fontStyle: 'bold' },
      5: { halign: 'right' },
      6: { halign: 'right' },
      7: { halign: 'center', fontStyle: 'bold', cellWidth: 16 },
    },
    willDrawCell(data) {
      if (data.section === 'body' && data.column.index === 7) {
        const abc = data.cell.text[0]
        if      (abc === 'A') data.doc.setTextColor(220, 38, 38)
        else if (abc === 'B') data.doc.setTextColor(217, 119,  6)
        else                  data.doc.setTextColor(100, 116, 139)
      }
    },
  })

  // ── Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(160)
    doc.text(
      `Seite ${i} von ${pageCount}  |  ABC/XYZ Analyse  |  HTW Berlin`,
      148.5, 205, { align: 'center' }
    )
  }

  doc.save('abc_xyz_analyse.pdf')
}
