// Advanced Solar Calculator for Sacramento
// Handles complex calculations with local data and multiple variables

// Sacramento-specific constants
const SACRAMENTO_DATA = {
    averageSunHours: 5.5, // Peak sun hours per day
    averageKwhCost: 0.145, // SMUD average rate per kWh
    solarIrradiance: 1900, // Annual kWh/kW potential
    panelWattage: 400, // Standard panel wattage
    panelSize: 20, // Square feet per panel
    systemCostPerWatt: 3.50, // Average cost per watt installed
    federalTaxCredit: 0.30, // 30% federal tax credit
    efficiency: {
        south: 1.0,
        southwest: 0.95,
        southeast: 0.95,
        west: 0.85,
        east: 0.85,
        north: 0.65
    },
    shadingFactors: {
        none: 1.0,
        minimal: 0.95,
        moderate: 0.85,
        heavy: 0.70
    },
    tiltFactors: {
        flat: 0.90,
        low: 0.95,
        medium: 1.0,
        steep: 0.92
    }
};

// Show/hide loan term based on payment method
document.getElementById('payment-method').addEventListener('change', function() {
    const loanTermGroup = document.getElementById('loan-term-group');
    if (this.value === 'loan') {
        loanTermGroup.style.display = 'block';
    } else {
        loanTermGroup.style.display = 'none';
    }
});

// Main calculation function
function calculateAdvancedSavings() {
    // Get input values
    const monthlyBill = parseFloat(document.getElementById('monthly-bill').value) || 0;
    const annualKwh = parseFloat(document.getElementById('annual-kwh').value) || 0;
    const roofSize = parseFloat(document.getElementById('roof-size').value) || 0;
    const roofDirection = document.getElementById('roof-direction').value;
    const roofTilt = document.getElementById('roof-tilt').value;
    const shading = document.getElementById('shading').value;
    const paymentMethod = document.getElementById('payment-method').value;
    const loanTerm = parseInt(document.getElementById('loan-term').value) || 20;
    
    // Validate inputs
    if (monthlyBill === 0 && annualKwh === 0) {
        alert('Please enter either your monthly bill or annual kWh usage.');
        return;
    }
    
    if (roofSize === 0) {
        alert('Please enter your available roof space.');
        return;
    }
    
    // Calculate annual energy usage
    let estimatedAnnualKwh;
    if (annualKwh > 0) {
        estimatedAnnualKwh = annualKwh;
    } else {
        estimatedAnnualKwh = (monthlyBill / SACRAMENTO_DATA.averageKwhCost) * 12;
    }
    
    // Calculate system size needed (with some buffer)
    const systemSizeKw = estimatedAnnualKwh / SACRAMENTO_DATA.solarIrradiance;
    
    // Calculate maximum system size based on roof space
    const maxPanels = Math.floor(roofSize / SACRAMENTO_DATA.panelSize);
    const maxSystemSizeKw = (maxPanels * SACRAMENTO_DATA.panelWattage) / 1000;
    
    // Use the smaller of needed or maximum possible system size
    const actualSystemSizeKw = Math.min(systemSizeKw, maxSystemSizeKw);
    const panelCount = Math.ceil((actualSystemSizeKw * 1000) / SACRAMENTO_DATA.panelWattage);
    
    // Apply efficiency factors
    const directionFactor = SACRAMENTO_DATA.efficiency[roofDirection] || 1.0;
    const shadingFactor = SACRAMENTO_DATA.shadingFactors[shading] || 1.0;
    const tiltFactor = SACRAMENTO_DATA.tiltFactors[roofTilt] || 1.0;
    
    const totalEfficiencyFactor = directionFactor * shadingFactor * tiltFactor;
    
    // Calculate annual production
    const annualProductionKwh = actualSystemSizeKw * SACRAMENTO_DATA.solarIrradiance * totalEfficiencyFactor;
    
    // Calculate costs
    const systemCostBeforeIncentives = actualSystemSizeKw * 1000 * SACRAMENTO_DATA.systemCostPerWatt;
    const federalTaxCredit = systemCostBeforeIncentives * SACRAMENTO_DATA.federalTaxCredit;
    const netSystemCost = systemCostBeforeIncentives - federalTaxCredit;
    
    // Calculate savings
    const annualSavings = annualProductionKwh * SACRAMENTO_DATA.averageKwhCost;
    const monthlySavings = annualSavings / 12;
    
    // Calculate payback period
    let effectiveCost = netSystemCost;
    let monthlyPayment = 0;
    
    if (paymentMethod === 'loan') {
        const interestRate = 0.06; // 6% annual interest rate
        const monthlyRate = interestRate / 12;
        const numPayments = loanTerm * 12;
        monthlyPayment = netSystemCost * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
        effectiveCost = monthlyPayment * numPayments;
    }
    
    const paybackPeriod = effectiveCost / annualSavings;
    const breakEvenYear = new Date().getFullYear() + Math.ceil(paybackPeriod);
    
    // Calculate 25-year savings
    const lifetimeSavings = (annualSavings * 25) - effectiveCost;
    const roi = ((lifetimeSavings / effectiveCost) * 100);
    
    // Update results display
    updateResults({
        systemSizeKw: actualSystemSizeKw,
        panelCount: panelCount,
        annualProductionKwh: annualProductionKwh,
        systemCostBeforeIncentives: systemCostBeforeIncentives,
        federalTaxCredit: federalTaxCredit,
        netSystemCost: netSystemCost,
        monthlySavings: monthlySavings,
        annualSavings: annualSavings,
        lifetimeSavings: lifetimeSavings,
        paybackPeriod: paybackPeriod,
        breakEvenYear: breakEvenYear,
        roi: roi,
        monthlyPayment: monthlyPayment,
        paymentMethod: paymentMethod
    });
    
    // Show results
    document.getElementById('calculator-results').style.display = 'block';
    
    // Scroll to results
    document.getElementById('calculator-results').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Update the results display
function updateResults(data) {
    // System Specifications
    document.getElementById('system-size').textContent = `${data.systemSizeKw.toFixed(1)} kW`;
    document.getElementById('panel-count').textContent = `${data.panelCount} panels`;
    document.getElementById('annual-production').textContent = `${data.annualProductionKwh.toLocaleString()} kWh/year`;
    
    // Financial Analysis
    document.getElementById('system-cost').textContent = `$${data.systemCostBeforeIncentives.toLocaleString()}`;
    document.getElementById('tax-credit').textContent = `$${data.federalTaxCredit.toLocaleString()}`;
    document.getElementById('net-cost').textContent = `$${data.netSystemCost.toLocaleString()}`;
    
    // Savings Breakdown
    document.getElementById('monthly-savings').textContent = `$${data.monthlySavings.toFixed(0)}`;
    document.getElementById('annual-savings').textContent = `$${data.annualSavings.toLocaleString()}`;
    document.getElementById('lifetime-savings').textContent = `$${data.lifetimeSavings.toLocaleString()}`;
    
    // Payback Analysis
    document.getElementById('payback-period').textContent = `${data.paybackPeriod.toFixed(1)} years`;
    document.getElementById('breakeven-year').textContent = `${data.breakEvenYear}`;
    document.getElementById('roi').textContent = `${data.roi.toFixed(0)}%`;
    
    // Store data for printing
    window.calculatorResults = data;
}

// Print results function
function printResults() {
    if (!window.calculatorResults) {
        alert('Please calculate your savings first.');
        return;
    }
    
    // Create print-friendly content
    const printContent = generatePrintContent(window.calculatorResults);
    const printWindow = window.open('', '', 'height=600,width=800');
    
    printWindow.document.write(`
        <html>
        <head>
            <title>Sacramento Solar Calculator Results</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .section { margin-bottom: 20px; }
                .section h3 { color: #f7931e; border-bottom: 2px solid #f7931e; padding-bottom: 5px; }
                .result-row { display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid #eee; }
                .highlight { font-weight: bold; color: #f7931e; }
                .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
            </style>
        </head>
        <body>
            ${printContent}
            <script>window.print(); window.close();</script>
        </body>
        </html>
    `);
    
    printWindow.document.close();
}

// Generate print content
function generatePrintContent(data) {
    const currentDate = new Date().toLocaleDateString();
    
    return `
        <div class="header">
            <h1>Sacramento Solar Calculator Results</h1>
            <p>Generated on ${currentDate}</p>
        </div>
        
        <div class="section">
            <h3>System Specifications</h3>
            <div class="result-row">
                <span>Recommended System Size:</span>
                <span>${data.systemSizeKw.toFixed(1)} kW</span>
            </div>
            <div class="result-row">
                <span>Number of Panels:</span>
                <span>${data.panelCount} panels</span>
            </div>
            <div class="result-row">
                <span>Annual Energy Production:</span>
                <span>${data.annualProductionKwh.toLocaleString()} kWh/year</span>
            </div>
        </div>
        
        <div class="section">
            <h3>Financial Analysis</h3>
            <div class="result-row">
                <span>System Cost (before incentives):</span>
                <span>$${data.systemCostBeforeIncentives.toLocaleString()}</span>
            </div>
            <div class="result-row">
                <span>Federal Tax Credit (30%):</span>
                <span>$${data.federalTaxCredit.toLocaleString()}</span>
            </div>
            <div class="result-row">
                <span>Net Cost After Incentives:</span>
                <span class="highlight">$${data.netSystemCost.toLocaleString()}</span>
            </div>
        </div>
        
        <div class="section">
            <h3>Savings Analysis</h3>
            <div class="result-row">
                <span>Monthly Savings:</span>
                <span>$${data.monthlySavings.toFixed(0)}</span>
            </div>
            <div class="result-row">
                <span>Annual Savings:</span>
                <span>$${data.annualSavings.toLocaleString()}</span>
            </div>
            <div class="result-row">
                <span>25-Year Savings:</span>
                <span class="highlight">$${data.lifetimeSavings.toLocaleString()}</span>
            </div>
        </div>
        
        <div class="section">
            <h3>Payback Analysis</h3>
            <div class="result-row">
                <span>Payback Period:</span>
                <span>${data.paybackPeriod.toFixed(1)} years</span>
            </div>
            <div class="result-row">
                <span>Break-even Year:</span>
                <span>${data.breakEvenYear}</span>
            </div>
            <div class="result-row">
                <span>ROI After 25 Years:</span>
                <span>${data.roi.toFixed(0)}%</span>
            </div>
        </div>
        
        <div class="footer">
            <p>This calculation is an estimate based on Sacramento, CA solar conditions and SMUD rates.</p>
            <p>Actual results may vary. Contact local solar installers for precise quotes.</p>
            <p>Sacramento Solar Companies - sacramentosolarcompanies.com</p>
        </div>
    `;
}

// Reset calculator function
function resetCalculator() {
    // Reset all form inputs
    document.getElementById('address').value = '';
    document.getElementById('zip-code').value = '';
    document.getElementById('monthly-bill').value = '';
    document.getElementById('annual-kwh').value = '';
    document.getElementById('roof-size').value = '';
    document.getElementById('roof-direction').value = 'south';
    document.getElementById('roof-tilt').value = 'medium';
    document.getElementById('shading').value = 'none';
    document.getElementById('payment-method').value = 'cash';
    document.getElementById('loan-term').value = '20';
    
    // Hide loan term group
    document.getElementById('loan-term-group').style.display = 'none';
    
    // Reset all result values
    const resultElements = [
        'system-size', 'panel-count', 'annual-production',
        'system-cost', 'tax-credit', 'net-cost',
        'monthly-savings', 'annual-savings', 'lifetime-savings',
        'payback-period', 'breakeven-year', 'roi'
    ];
    
    resultElements.forEach(id => {
        document.getElementById(id).textContent = '-';
    });
    
    // Clear stored results
    window.calculatorResults = null;
    
    // Scroll to top of form
    document.querySelector('.calculator-inputs').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Initialize calculator when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Hide results initially
    document.getElementById('calculator-results').style.display = 'block';
    
    // Add input validation
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
    
    // Auto-calculate on significant input changes (with debounce)
    let calcTimeout;
    const autoCalcInputs = ['monthly-bill', 'annual-kwh', 'roof-size'];
    
    autoCalcInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', function() {
            clearTimeout(calcTimeout);
            calcTimeout = setTimeout(() => {
                if (this.value && parseFloat(this.value) > 0) {
                    const monthlyBill = parseFloat(document.getElementById('monthly-bill').value) || 0;
                    const annualKwh = parseFloat(document.getElementById('annual-kwh').value) || 0;
                    const roofSize = parseFloat(document.getElementById('roof-size').value) || 0;
                    
                    if ((monthlyBill > 0 || annualKwh > 0) && roofSize > 0) {
                        calculateAdvancedSavings();
                    }
                }
            }, 1000);
        });
    });
});