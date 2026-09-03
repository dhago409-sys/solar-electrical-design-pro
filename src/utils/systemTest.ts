import { Calculations, LoadItem, CanvasElement, Connection } from '../types';
import { checkMPPTCompatibility, calculatePVVoltage, calculatePVCurrent } from './calculations';

export interface TestIssue {
  category: string;
  status: 'pass' | 'warning' | 'fail';
  problem: string;
  explanation: string;
  recommendation: string;
}

export const runSystemTest = (
  calculations: Calculations,
  loads: LoadItem[],
  elements: CanvasElement[]
): TestIssue[] => {
  const issues: TestIssue[] = [];

  // Test PV Sizing
  if (!calculations.pvSize || calculations.pvSize === 0) {
    issues.push({
      category: 'PV Sizing',
      status: 'fail',
      problem: 'PV size not calculated',
      explanation: 'The system cannot operate without knowing the required PV capacity',
      recommendation: 'Use the PV Calculator to determine required PV size based on energy consumption and location'
    });
  } else if (calculations.pvSize < 1000) {
    issues.push({
      category: 'PV Sizing',
      status: 'warning',
      problem: 'PV size is very small',
      explanation: 'System with less than 1kW PV capacity may not generate sufficient energy',
      recommendation: 'Review energy requirements and increase PV size if possible'
    });
  } else {
    issues.push({
      category: 'PV Sizing',
      status: 'pass',
      problem: 'PV sizing validated',
      explanation: 'PV capacity is adequate',
      recommendation: ''
    });
  }

  // Test PV Voltage
  if (calculations.pvVoltage) {
    if (calculations.pvVoltage < 250) {
      issues.push({
        category: 'PV Voltage',
        status: 'fail',
        problem: 'PV voltage too low',
        explanation: 'PV voltage below 250V may cause inefficiency in inverter MPPT tracking',
        recommendation: 'Increase number of series panels or use higher voltage panels'
      });
    } else if (calculations.pvVoltage > 800) {
      issues.push({
        category: 'PV Voltage',
        status: 'warning',
        problem: 'PV voltage very high',
        explanation: 'PV voltage above 800V increases safety risks and equipment requirements',
        recommendation: 'Use multiple strings or reduce series panels'
      });
    } else {
      issues.push({
        category: 'PV Voltage',
        status: 'pass',
        problem: 'PV voltage in acceptable range',
        explanation: `PV voltage of ${calculations.pvVoltage}V is within safe operating range`,
        recommendation: ''
      });
    }
  }

  // Test PV Current
  if (calculations.pvCurrent) {
    if (calculations.pvCurrent > 200) {
      issues.push({
        category: 'PV Current',
        status: 'warning',
        problem: 'PV current is very high',
        explanation: 'High currents require oversized cables and components',
        recommendation: 'Use higher voltage configuration or additional series strings'
      });
    } else {
      issues.push({
        category: 'PV Current',
        status: 'pass',
        problem: 'PV current acceptable',
        explanation: `PV current of ${calculations.pvCurrent}A is manageable`,
        recommendation: ''
      });
    }
  }

  // Test Inverter Sizing
  const totalLoad = loads.reduce((sum, load) => sum + load.watts, 0);
  if (!calculations.inverterSize || calculations.inverterSize === 0) {
    issues.push({
      category: 'Inverter Sizing',
      status: 'fail',
      problem: 'Inverter size not determined',
      explanation: 'Inverter must be sized according to system loads',
      recommendation: 'Use Inverter Calculator to size inverter based on loads and surge requirements'
    });
  } else if (calculations.inverterSize < totalLoad) {
    issues.push({
      category: 'Inverter Sizing',
      status: 'fail',
      problem: 'Inverter undersized',
      explanation: `Inverter capacity (${calculations.inverterSize}W) is less than total load (${totalLoad}W)`,
      recommendation: 'Increase inverter size or reduce connected loads'
    });
  } else if (calculations.inverterSize < totalLoad * 1.2) {
    issues.push({
      category: 'Inverter Sizing',
      status: 'warning',
      problem: 'Inverter has minimal headroom',
      explanation: 'Inverter capacity should be at least 20% larger than peak load for safety',
      recommendation: 'Increase inverter size or reduce peak loads'
    });
  } else {
    issues.push({
      category: 'Inverter Sizing',
      status: 'pass',
      problem: 'Inverter correctly sized',
      explanation: `Inverter capacity (${calculations.inverterSize}W) exceeds peak load (${totalLoad}W)`,
      recommendation: ''
    });
  }

  // Test Battery Sizing
  if (!calculations.batteryCapacity || calculations.batteryCapacity === 0) {
    issues.push({
      category: 'Battery Sizing',
      status: 'fail',
      problem: 'Battery capacity not calculated',
      explanation: 'Battery size affects system reliability and backup duration',
      recommendation: 'Use Battery Calculator to determine required capacity based on backup hours'
    });
  } else {
    issues.push({
      category: 'Battery Sizing',
      status: 'pass',
      problem: 'Battery capacity determined',
      explanation: `Battery capacity of ${calculations.batteryCapacity}Wh will provide ${calculations.backupHours || 'N/A'} hours backup`,
      recommendation: ''
    });
  }

  // Test Cable Sizing
  const hasCables = elements.some(e => e.category === 'CABLES');
  if (!hasCables && elements.length > 0) {
    issues.push({
      category: 'Cable Sizing',
      status: 'warning',
      problem: 'No cables specified in design',
      explanation: 'Proper cable sizing is critical for safety and efficiency',
      recommendation: 'Use Cable Calculator to determine cable sizes for all connections'
    });
  } else {
    issues.push({
      category: 'Cable Sizing',
      status: 'pass',
      problem: 'Cables included in design',
      explanation: 'Cable specifications are documented',
      recommendation: ''
    });
  }

  // Test Protection
  const hasProtection = elements.some(e => 
    ['DC breaker', 'AC breaker', 'Fuse', 'SPD', 'RCD'].includes(e.subcategory || '')
  );
  if (!hasProtection && elements.length > 0) {
    issues.push({
      category: 'Protection',
      status: 'fail',
      problem: 'No protection devices specified',
      explanation: 'Protection devices are essential for safety and equipment protection',
      recommendation: 'Add DC breakers, AC breakers, fuses, and surge protectors to the design'
    });
  } else {
    issues.push({
      category: 'Protection',
      status: 'pass',
      problem: 'Protection devices included',
      explanation: 'System includes necessary protection components',
      recommendation: ''
    });
  }

  return issues;
};

export const getTestSummary = (issues: TestIssue[]) => {
  const passCount = issues.filter(i => i.status === 'pass').length;
  const warningCount = issues.filter(i => i.status === 'warning').length;
  const failCount = issues.filter(i => i.status === 'fail').length;

  if (failCount > 0) {
    return {
      status: 'fail',
      message: 'DESIGN NEEDS CORRECTION',
      description: `${failCount} critical issue(s) found that must be resolved`,
      passCount,
      warningCount,
      failCount
    };
  } else if (warningCount > 0) {
    return {
      status: 'warning',
      message: 'DESIGN PASSED WITH WARNINGS',
      description: `${warningCount} warning(s) to review and address if possible`,
      passCount,
      warningCount,
      failCount
    };
  } else {
    return {
      status: 'pass',
      message: 'DESIGN PASSED',
      description: 'All system requirements validated successfully',
      passCount,
      warningCount,
      failCount
    };
  }
};
