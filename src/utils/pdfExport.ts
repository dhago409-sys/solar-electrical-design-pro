import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Project, ProjectData } from '../types';

export interface PDFContent {
  customerName: string;
  projectName: string;
  location: string;
  systemType: string;
  data: ProjectData;
  companyLogo?: string;
  companyName?: string;
  designerName?: string;
  notes?: string;
}

export const generateProjectPDF = async (content: PDFContent) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  // Set colors
  pdf.setTextColor(33, 37, 41); // Dark gray
  const accentColor = [245, 158, 11]; // Amber

  // Title Block
  pdf.setFontSize(20);
  pdf.setFont(undefined, 'bold');
  pdf.text('SOLAR & ELECTRICAL DESIGN PRO', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  if (content.companyName) {
    pdf.text(`Project by: ${content.companyName}`, 20, yPosition);
    yPosition += 5;
  }
  if (content.designerName) {
    pdf.text(`Designer: ${content.designerName}`, 20, yPosition);
    yPosition += 5;
  }
  pdf.text(`Date: ${new Date().toLocaleDateString()}`, 20, yPosition);
  yPosition += 10;

  // Customer Information
  pdf.setFont(undefined, 'bold');
  pdf.text('CUSTOMER INFORMATION', 20, yPosition);
  yPosition += 7;
  
  pdf.setFont(undefined, 'normal');
  pdf.setFontSize(9);
  pdf.text(`Customer: ${content.customerName}`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Project: ${content.projectName}`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Location: ${content.location}`, 20, yPosition);
  yPosition += 5;
  pdf.text(`System Type: ${content.systemType}`, 20, yPosition);
  yPosition += 10;

  // System Summary
  pdf.setFont(undefined, 'bold');
  pdf.text('SYSTEM SUMMARY', 20, yPosition);
  yPosition += 7;

  pdf.setFont(undefined, 'normal');
  const summary = [
    `PV System Size: ${(content.data.calculations?.pvSize || 0) / 1000}kW`,
    `Number of Panels: ${content.data.calculations?.numPanels || 'N/A'}`,
    `PV Voltage: ${content.data.calculations?.pvVoltage || 'N/A'}V`,
    `Inverter Capacity: ${(content.data.calculations?.inverterSize || 0) / 1000}kW`,
    `Battery Capacity: ${(content.data.calculations?.batteryCapacity || 0) / 1000}kWh`,
    `Daily Energy: ${content.data.calculations?.dailyEnergy || 'N/A'}kWh`,
    `Backup Time: ${content.data.calculations?.backupHours || 'N/A'} hours`
  ];

  summary.forEach(line => {
    if (yPosition > pageHeight - 20) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.text(line, 20, yPosition);
    yPosition += 5;
  });
  yPosition += 5;

  // Load Schedule
  if (content.data.loads && content.data.loads.length > 0) {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFont(undefined, 'bold');
    pdf.text('LOAD SCHEDULE', 20, yPosition);
    yPosition += 7;

    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);

    const tableData = content.data.loads.map(load => [
      load.equipment,
      load.quantity.toString(),
      load.watts.toString(),
      load.hoursPerDay.toString(),
      (load.watts * load.hoursPerDay).toString()
    ]);

    (pdf as any).autoTable({
      head: [['Equipment', 'Qty', 'Watts', 'Hours/Day', 'Wh/Day']],
      body: tableData,
      startY: yPosition,
      margin: 20,
      theme: 'grid',
      headStyles: { fillColor: accentColor, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 10;
  }

  // Bill of Materials
  if (content.data.bom && content.data.bom.length > 0) {
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text('BILL OF MATERIALS', 20, yPosition);
    yPosition += 7;

    pdf.setFontSize(8);
    const bomData = content.data.bom.map(item => [
      item.equipment,
      item.specification,
      item.quantity.toString(),
      `$${item.unitPrice}`,
      `$${item.total}`
    ]);

    (pdf as any).autoTable({
      head: [['Equipment', 'Specification', 'Qty', 'Unit Price', 'Total']],
      body: bomData,
      startY: yPosition,
      margin: 20,
      theme: 'grid',
      headStyles: { fillColor: accentColor, textColor: 255 },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 10;
  }

  // Cost Estimate
  if (content.data.costEstimate) {
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text('COST ESTIMATE', 20, yPosition);
    yPosition += 7;

    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(9);
    const estimate = content.data.costEstimate;
    const costs = [
      [`Equipment Cost:`, `${estimate.currency} ${estimate.equipment.toFixed(2)}`],
      [`Labor:`, `${estimate.currency} ${estimate.labor.toFixed(2)}`],
      [`Transportation:`, `${estimate.currency} ${estimate.transportation.toFixed(2)}`],
      [`Installation:`, `${estimate.currency} ${estimate.installation.toFixed(2)}`],
      [`Engineering:`, `${estimate.currency} ${estimate.engineering.toFixed(2)}`],
      [`Other:`, `${estimate.currency} ${estimate.other.toFixed(2)}`],
      [`Subtotal:`, `${estimate.currency} ${estimate.subtotal.toFixed(2)}`],
      [`Profit (${((estimate.profit / estimate.subtotal) * 100).toFixed(0)}%):`, `${estimate.currency} ${estimate.profit.toFixed(2)}`]
    ];

    costs.forEach(([label, value]) => {
      pdf.text(label, 20, yPosition);
      pdf.text(value, 150, yPosition, { align: 'right' });
      yPosition += 5;
    });

    pdf.setFont(undefined, 'bold');
    pdf.text('TOTAL PRICE:', 20, yPosition);
    pdf.text(`${estimate.currency} ${estimate.total.toFixed(2)}`, 150, yPosition, { align: 'right' });
    yPosition += 10;
  }

  // Notes
  if (content.notes) {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }
    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text('NOTES', 20, yPosition);
    yPosition += 5;
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(9);
    const splitText = pdf.splitTextToSize(content.notes, 170);
    pdf.text(splitText, 20, yPosition);
  }

  return pdf;
};

export const downloadPDF = (pdf: jsPDF, filename: string) => {
  pdf.save(filename);
};
