import React, { useState } from 'react';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { useProjectStore } from '../store/projectStore';
import { Project } from '../types';
import jsPDF from 'jspdf';

interface QuotationProps {
  project: Project;
  onBack: () => void;
}

function Quotation({ project, onBack }: QuotationProps) {
  const { currentProjectData } = useProjectStore();
  const [quotationNumber, setQuotationNumber] = useState(`QT-${Date.now()}`);
  const [validityDays, setValidityDays] = useState(30);
  const [companyName, setCompanyName] = useState('Solar & Electrical Design Pro');
  const [companyEmail, setCompanyEmail] = useState('info@solardesign.com');
  const [companyPhone, setCompanyPhone] = useState('+1-800-SOLAR');
  const [terms, setTerms] = useState('Payment due within 30 days of invoice. 50% advance, 50% on completion.');

  const calculations = currentProjectData?.calculations || {};
  const bom = currentProjectData?.bom || [];
  const costEstimate = currentProjectData?.costEstimate || {
    equipment: 0,
    labor: 0,
    transportation: 0,
    installation: 0,
    engineering: 0,
    other: 0,
    subtotal: 0,
    profit: 0,
    total: 0,
    currency: 'USD'
  };

  const quotationDate = new Date().toLocaleDateString();
  const validUntil = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000).toLocaleDateString();

  const handleGeneratePDF = () => {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    let yPosition = 20;

    // Header
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(255, 177, 28);
    pdf.text('QUOTATION', 20, yPosition);
    yPosition += 15;

    // Company Info
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');
    pdf.text(companyName, 20, yPosition);
    yPosition += 5;
    pdf.text(companyEmail, 20, yPosition);
    yPosition += 5;
    pdf.text(companyPhone, 20, yPosition);
    yPosition += 10;

    // Quotation Details
    pdf.setFont(undefined, 'bold');
    pdf.text('Quotation #:', 20, yPosition);
    pdf.setFont(undefined, 'normal');
    pdf.text(quotationNumber, 80, yPosition);
    yPosition += 5;
    pdf.setFont(undefined, 'bold');
    pdf.text('Date:', 20, yPosition);
    pdf.setFont(undefined, 'normal');
    pdf.text(quotationDate, 80, yPosition);
    yPosition += 5;
    pdf.setFont(undefined, 'bold');
    pdf.text('Valid Until:', 20, yPosition);
    pdf.setFont(undefined, 'normal');
    pdf.text(validUntil, 80, yPosition);
    yPosition += 10;

    // Customer Info
    pdf.setFont(undefined, 'bold');
    pdf.text('CUSTOMER INFORMATION', 20, yPosition);
    yPosition += 5;
    pdf.setFont(undefined, 'normal');
    pdf.text(`Customer: ${project.customerName}`, 20, yPosition);
    yPosition += 4;
    pdf.text(`Project: ${project.projectName}`, 20, yPosition);
    yPosition += 4;
    pdf.text(`Location: ${project.location}`, 20, yPosition);
    yPosition += 4;
    pdf.text(`Phone: ${project.phone}`, 20, yPosition);
    yPosition += 4;
    pdf.text(`Email: ${project.email}`, 20, yPosition);
    yPosition += 10;

    // System Summary
    pdf.setFont(undefined, 'bold');
    pdf.text('SYSTEM SUMMARY', 20, yPosition);
    yPosition += 5;
    pdf.setFont(undefined, 'normal');
    const summary = [
      `System Type: ${project.systemType}`,
      `PV Capacity: ${(calculations.pvSize || 0) / 1000} kW`,
      `Number of Panels: ${calculations.numPanels || 'N/A'}`,
      `Inverter: ${(calculations.inverterSize || 0) / 1000} kW`,
      `Battery Capacity: ${(calculations.batteryCapacity || 0) / 1000} kWh`,
      `Backup Duration: ${calculations.backupHours ? calculations.backupHours.toFixed(1) : 'N/A'} hours`,
      `Daily Energy: ${(calculations.dailyEnergy || 0).toFixed(1)} kWh`
    ];

    summary.forEach(line => {
      if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(line, 20, yPosition);
      yPosition += 4;
    });
    yPosition += 5;

    // BOM
    if (bom.length > 0 && yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFont(undefined, 'bold');
    pdf.text('BILL OF MATERIALS', 20, yPosition);
    yPosition += 7;

    pdf.setFontSize(8);
    const bomData = bom.map(item => [
      item.equipment,
      item.quantity.toString(),
      `$${item.unitPrice.toFixed(2)}`,
      `$${item.total.toFixed(2)}`
    ]);

    (pdf as any).autoTable({
      head: [['Equipment', 'Qty', 'Unit Price', 'Total']],
      body: bomData,
      startY: yPosition,
      margin: 20,
      theme: 'grid',
      headStyles: { fillColor: [255, 177, 28], textColor: 255 }
    });

    yPosition = (pdf as any).lastAutoTable.finalY + 10;

    // Cost Summary
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text('COST SUMMARY', 20, yPosition);
    yPosition += 7;

    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(9);
    const costLines = [
      [`Equipment Cost:`, `$${costEstimate.equipment.toFixed(2)}`],
      [`Labor:`, `$${costEstimate.labor.toFixed(2)}`],
      [`Transport:`, `$${costEstimate.transportation.toFixed(2)}`],
      [`Installation:`, `$${costEstimate.installation.toFixed(2)}`],
      [`Other:`, `$${costEstimate.other.toFixed(2)}`]
    ];

    costLines.forEach(([label, value]) => {
      pdf.text(label, 20, yPosition);
      pdf.text(value, 150, yPosition, { align: 'right' });
      yPosition += 5;
    });

    pdf.setFont(undefined, 'bold');
    pdf.text('Subtotal:', 20, yPosition);
    pdf.text(`$${costEstimate.subtotal.toFixed(2)}`, 150, yPosition, { align: 'right' });
    yPosition += 5;
    pdf.text('Profit:', 20, yPosition);
    pdf.text(`$${costEstimate.profit.toFixed(2)}`, 150, yPosition, { align: 'right' });
    yPosition += 8;

    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(12);
    pdf.text('GRAND TOTAL:', 20, yPosition);
    pdf.text(`${costEstimate.currency} $${costEstimate.total.toFixed(2)}`, 150, yPosition, { align: 'right' });

    // Terms
    if (yPosition > pageHeight - 50) {
      pdf.addPage();
      yPosition = 20;
    } else {
      yPosition += 15;
    }

    pdf.setFont(undefined, 'bold');
    pdf.setFontSize(10);
    pdf.text('TERMS & CONDITIONS', 20, yPosition);
    yPosition += 5;

    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(8);
    const splitTerms = pdf.splitTextToSize(terms, 170);
    pdf.text(splitTerms, 20, yPosition);

    pdf.save(`${project.projectName}-quotation.pdf`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-800 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Design
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Quotation Settings */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <FileText size={24} />
              Quotation Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Quotation Number</label>
                <input
                  type="text"
                  value={quotationNumber}
                  onChange={(e) => setQuotationNumber(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Company Email</label>
                <input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Company Phone</label>
                <input
                  type="tel"
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Validity (Days)</label>
                <input
                  type="number"
                  value={validityDays}
                  onChange={(e) => setValidityDays(parseInt(e.target.value) || 30)}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Terms & Conditions</label>
                <textarea
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500 h-32"
                />
              </div>
            </div>
          </div>

          {/* Quotation Preview */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-8 border-l-4 border-solar-500">
            <div className="text-center mb-8">
              <p className="text-solar-500 font-bold text-sm">QUOTATION</p>
              <h1 className="text-4xl font-bold mt-2">{project.projectName}</h1>
              <p className="text-gray-600 mt-2">for {project.customerName}</p>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="font-bold text-sm mb-2 text-gray-600">FROM</h3>
                <p className="font-bold">{companyName}</p>
                <p className="text-sm text-gray-600">{companyEmail}</p>
                <p className="text-sm text-gray-600">{companyPhone}</p>
              </div>
              <div>
                <h3 className="font-bold text-sm mb-2 text-gray-600">CUSTOMER</h3>
                <p className="font-bold">{project.customerName}</p>
                <p className="text-sm text-gray-600">{project.location}</p>
                <p className="text-sm text-gray-600">{project.email}</p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded mb-8 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-gray-600 text-sm font-bold">Quotation #</p>
                <p className="font-mono font-bold">{quotationNumber}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-bold">Date</p>
                <p className="font-bold">{quotationDate}</p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-bold">Valid Until</p>
                <p className="font-bold">{validUntil}</p>
              </div>
            </div>

            {/* System Summary */}
            <div className="mb-8">
              <h3 className="font-bold text-lg mb-4">System Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">PV Capacity</p>
                  <p className="text-2xl font-bold text-blue-600">{(calculations.pvSize || 0) / 1000} kWp</p>
                </div>
                <div className="bg-blue-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Number of Panels</p>
                  <p className="text-2xl font-bold text-blue-600">{calculations.numPanels || 0}</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Inverter Size</p>
                  <p className="text-2xl font-bold text-green-600">{(calculations.inverterSize || 0) / 1000} kW</p>
                </div>
                <div className="bg-green-50 p-3 rounded">
                  <p className="text-sm text-gray-600">Battery Storage</p>
                  <p className="text-2xl font-bold text-green-600">{(calculations.batteryCapacity || 0) / 1000} kWh</p>
                </div>
              </div>
            </div>

            {/* Cost Summary */}
            <div className="border-t-2 pt-6">
              <h3 className="font-bold text-lg mb-4">Cost Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Equipment Subtotal</span>
                  <span className="font-bold">${costEstimate.equipment.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Labor & Installation</span>
                  <span className="font-bold">${(costEstimate.labor + costEstimate.installation).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport & Other</span>
                  <span className="font-bold">${(costEstimate.transportation + costEstimate.other).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-t-2 border-b-2 text-lg">
                  <span className="font-bold">Subtotal</span>
                  <span className="font-bold">${costEstimate.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Profit Margin</span>
                  <span className="font-bold text-green-600">${costEstimate.profit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-4 text-2xl text-solar-600 font-bold">
                  <span>TOTAL</span>
                  <span>${costEstimate.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={handleGeneratePDF}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all"
          >
            <Download size={20} />
            Generate PDF Quotation
          </button>
          <button
            onClick={onBack}
            className="flex-1 bg-gray-400 hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Back to Design
          </button>
        </div>
      </div>
    </div>
  );
}

export default Quotation;