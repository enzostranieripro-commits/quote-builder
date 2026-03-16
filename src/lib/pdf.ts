import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Devis, Entreprise } from "@/types";
import { calcHT as calculerTotalLigneHT, calcTotaux as calculerTotauxDevis, fmt as formatMontant } from "@/types";

export function generateDevisPDF(devis: Devis, entreprise: Entreprise) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  let y = 20;

  // Colors
  const primary: [number, number, number] = [37, 99, 235]; // Trust Blue
  const dark: [number, number, number] = [15, 23, 42];
  const muted: [number, number, number] = [100, 116, 139];

  // ---- Header: Entreprise ----
  doc.setFontSize(18);
  doc.setTextColor(...primary);
  doc.setFont("helvetica", "bold");
  doc.text(entreprise.raisonSociale || "Votre Entreprise", margin, y);
  y += 6;

  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  const entLines = [
    entreprise.adresse && `${entreprise.adresse}, ${entreprise.codePostal} ${entreprise.ville}`,
    entreprise.telephone && `Tél: ${entreprise.telephone}`,
    entreprise.email && `Email: ${entreprise.email}`,
    entreprise.siret && `SIRET: ${entreprise.siret}`,
    entreprise.tvaIntracom && `TVA Intracom: ${entreprise.tvaIntracom}`,
    entreprise.rcs && `RCS: ${entreprise.rcs}`,
  ].filter(Boolean);

  entLines.forEach((line) => {
    doc.text(line!, margin, y);
    y += 3.5;
  });

  // ---- Devis title ----
  y = 20;
  doc.setFontSize(24);
  doc.setTextColor(...dark);
  doc.setFont("helvetica", "bold");
  doc.text("DEVIS", pageWidth - margin, y, { align: "right" });
  y = 28;
  doc.setFontSize(9);
  doc.setTextColor(...muted);
  doc.setFont("helvetica", "normal");
  doc.text(`N° ${devis.numero}`, pageWidth - margin, y, { align: "right" });
  y += 4;
  doc.text(`Date: ${formatDate(devis.dateCreation)}`, pageWidth - margin, y, { align: "right" });
  y += 4;
  doc.text(`Validité: ${formatDate(devis.dateValidite)}`, pageWidth - margin, y, { align: "right" });

  // ---- Line separator ----
  y = Math.max(y, 55);
  y += 5;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  // ---- Client info ----
  doc.setFontSize(8);
  doc.setTextColor(...primary);
  doc.setFont("helvetica", "bold");
  doc.text("DESTINATAIRE", pageWidth - margin - 70, y);
  y += 5;
  doc.setTextColor(...dark);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  const clientName = [devis.client.prenom, devis.client.nom].filter(Boolean).join(" ");
  if (devis.client.societe) {
    doc.text(devis.client.societe, pageWidth - margin - 70, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    if (clientName) { doc.text(clientName, pageWidth - margin - 70, y); y += 4; }
  } else {
    doc.text(clientName || "Client", pageWidth - margin - 70, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
  }
  doc.setTextColor(...muted);
  const clientLines = [
    devis.client.adresse && `${devis.client.adresse}`,
    (devis.client.codePostal || devis.client.ville) && `${devis.client.codePostal} ${devis.client.ville}`,
    devis.client.telephone && `Tél: ${devis.client.telephone}`,
    devis.client.email,
  ].filter(Boolean);
  clientLines.forEach((line) => {
    doc.text(line!, pageWidth - margin - 70, y);
    y += 3.5;
  });

  // ---- Objet ----
  y += 8;
  doc.setFontSize(8);
  doc.setTextColor(...primary);
  doc.setFont("helvetica", "bold");
  doc.text("OBJET", margin, y);
  y += 5;
  doc.setFontSize(10);
  doc.setTextColor(...dark);
  doc.text(devis.objet || "—", margin, y);
  if (devis.description) {
    y += 5;
    doc.setFontSize(9);
    doc.setTextColor(...muted);
    doc.setFont("helvetica", "normal");
    const descLines = doc.splitTextToSize(devis.description, pageWidth - 2 * margin);
    doc.text(descLines, margin, y);
    y += descLines.length * 4;
  }
  y += 8;

  // ---- Table ----
  const tableBody = devis.lignes.map((ligne) => [
    ligne.categorie,
    ligne.designation,
    ligne.unite,
    String(ligne.quantite),
    formatMontant(ligne.prixUnitaireHT),
    `${ligne.tva}%`,
    formatMontant(calculerTotalLigneHT(ligne)),
  ]);

  autoTable(doc, {
    startY: y,
    head: [["Catégorie", "Désignation", "Unité", "Qté", "P.U. HT", "TVA", "Total HT"]],
    body: tableBody,
    margin: { left: margin, right: margin },
    styles: {
      fontSize: 8,
      cellPadding: 3,
      textColor: dark,
      lineColor: [226, 232, 240],
      lineWidth: 0.3,
    },
    headStyles: {
      fillColor: [248, 250, 252],
      textColor: muted,
      fontStyle: "bold",
      fontSize: 7,
    },
    columnStyles: {
      0: { cellWidth: 25 },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 15, halign: "right", font: "courier" },
      4: { cellWidth: 22, halign: "right", font: "courier" },
      5: { cellWidth: 15, halign: "center" },
      6: { cellWidth: 25, halign: "right", font: "courier", fontStyle: "bold" },
    },
    alternateRowStyles: { fillColor: [248, 250, 252] },
  });

  // @ts-ignore - autoTable adds lastAutoTable
  y = doc.lastAutoTable?.finalY || y + 20;
  y += 8;

  // ---- Totaux ----
  const { totalHT, tvaDetails, totalTVA, totalTTC } = calculerTotauxDevis(devis.lignes);
  const totalsX = pageWidth - margin - 80;

  const drawTotalRow = (label: string, value: string, bold = false) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(bold ? 11 : 9);
    doc.setTextColor(...(bold ? dark : muted));
    doc.text(label, totalsX, y);
    doc.setTextColor(...dark);
    doc.text(value, pageWidth - margin, y, { align: "right" });
    y += bold ? 7 : 5;
  };

  drawTotalRow("Total HT", formatMontant(totalHT));
  Object.entries(tvaDetails).forEach(([rate, amount]) => {
    drawTotalRow(`TVA ${rate}%`, formatMontant(amount));
  });
  drawTotalRow("Total TVA", formatMontant(totalTVA));

  // Line before TTC
  doc.setDrawColor(226, 232, 240);
  doc.line(totalsX, y - 2, pageWidth - margin, y - 2);
  y += 2;
  drawTotalRow("TOTAL TTC", formatMontant(totalTTC), true);

  if (devis.conditions.acomptePercent > 0) {
    y += 2;
    const acompte = totalTTC * (devis.conditions.acomptePercent / 100);
    doc.setFontSize(9);
    doc.setTextColor(...primary);
    doc.setFont("helvetica", "bold");
    doc.text(`Acompte à verser (${devis.conditions.acomptePercent}%)`, totalsX, y);
    doc.text(formatMontant(acompte), pageWidth - margin, y, { align: "right" });
    y += 6;
  }

  // ---- Échéancier ----
  if (devis.conditions.echeancier.length > 0) {
    y += 5;
    checkNewPage();
    doc.setFontSize(8);
    doc.setTextColor(...primary);
    doc.setFont("helvetica", "bold");
    doc.text("ÉCHÉANCIER DE PAIEMENT", margin, y);
    y += 5;

    devis.conditions.echeancier.forEach((ech) => {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...dark);
      doc.text(`• ${ech.description} — ${ech.pourcentage}% (${formatMontant(totalTTC * (ech.pourcentage / 100))})`, margin + 2, y);
      y += 5;
    });
  }

  // ---- Conditions ----
  y += 5;
  checkNewPage();
  doc.setFontSize(8);
  doc.setTextColor(...primary);
  doc.setFont("helvetica", "bold");
  doc.text("CONDITIONS", margin, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...muted);

  if (devis.conditions.conditionsPaiement) {
    const condLines = doc.splitTextToSize(devis.conditions.conditionsPaiement, pageWidth - 2 * margin);
    doc.text(condLines, margin, y);
    y += condLines.length * 3.5;
  }

  y += 3;
  if (devis.conditions.mentionsLegales) {
    const mentLines = doc.splitTextToSize(
      devis.conditions.mentionsLegales.replace("{validite}", String(devis.conditions.validiteDuree)),
      pageWidth - 2 * margin
    );
    doc.text(mentLines, margin, y);
    y += mentLines.length * 3.5;
  }

  // ---- Signature area ----
  y += 15;
  checkNewPage();
  doc.setFontSize(8);
  doc.setTextColor(...muted);
  doc.text("Bon pour accord (date et signature du client) :", pageWidth - margin - 80, y);
  y += 3;
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.rect(pageWidth - margin - 80, y, 80, 25);

  // ---- Assurance décennale ----
  if (entreprise.assuranceDecennale) {
    const footY = doc.internal.pageSize.getHeight() - 10;
    doc.setFontSize(7);
    doc.setTextColor(...muted);
    doc.text(`Assurance décennale: ${entreprise.assuranceDecennale}`, margin, footY);
  }

  // Save
  doc.save(`${devis.numero}.pdf`);

  function checkNewPage() {
    if (y > doc.internal.pageSize.getHeight() - 30) {
      doc.addPage();
      y = 20;
    }
  }
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}
