// Sacramento Solar Savings Calculator
// Uses current SMUD rates and Sacramento-specific solar data

// SMUD Rate Data (as of 2025)
const SMUD_RATES = {
    tier1: 0.1089, // First 400 kWh
    tier2: 0.1345, // 401-1000 kWh
    tier3: 0.1598, // Over 1000 kWh
    summer_peak: 0.1899, // Summer peak hours
    winter_peak: 0.1345  // Winter peak hours
};

// Sacramento Solar Factors
const SACRAMENTO_FACTORS = {
    average_sunshine_hours: 6.5, // Average daily sunshine hours
    panel_efficiency: 0.20, // 20% average panel efficiency
    system_degradation: 0.005, // 0.5% annual degradation
    installation_cost_per_watt: 2.85, // Average cost per watt in Sacramento
    federal_tax_credit: 0.30, // 30% federal tax credit
    california_rebate: 0.10, // Additional California incentives
    smud_rebate: 0.05 // SMUD-specific rebates
};

// Calculate solar savings for Sacramento
function calculateSavings() {
    const monthlyBill = parseFloat(document.getElementById('monthly-bill').value);
    const roofSize = parseFloat(document.getElementById('roof-size').value);
    const address = document.getElementById('address').value;

    if (!monthlyBill || monthlyBill <= 0) {
        alert('Please enter a valid monthly electric bill amount.');
        return;
    }

    // Calculate annual electricity usage (kWh)
    const annualUsage = estimateAnnualUsage(monthlyBill);
    
    // Calculate system size needed
    const systemSizeKW = calculateSystemSize(annualUsage, roofSize);
    const systemSizeWatts = systemSizeKW * 1000;
    
    // Calculate installation cost
    const grossCost = systemSizeWatts * SACRAMENTO_FACTORS.installation_cost_per_watt;
    const federalCredit = grossCost * SACRAMENTO_FACTORS.federal_tax_credit;
    const californiaRebate = grossCost * SACRAMENTO_FACTORS.california_rebate;
    const smudRebate = grossCost * SACRAMENTO_FACTORS.smud_rebate;
    const netCost = grossCost - federalCredit - californiaRebate - smudRebate;
    
    // Calculate annual production
    const annualProduction = calculateAnnualProduction(systemSizeKW);
    
    // Calculate annual savings
    const annualSavings = calculateAnnualSavings(annualProduction, annualUsage);
    
    // Calculate payback period
    const paybackPeriod = netCost / annualSavings;
    
    // Display results
    displayResults({
        systemSize: systemSizeKW,
        estimatedCost: netCost,
        annualSavings: annualSavings,
        paybackPeriod: paybackPeriod,
        annualProduction: annualProduction,
        grossCost: grossCost,
        incentives: {
            federal: federalCredit,
            california: californiaRebate,
            smud: smudRebate
        }
    });
}

// Estimate annual electricity usage based on monthly bill
function estimateAnnualUsage(monthlyBill) {
    // SMUD average rate calculation
    const averageRate = (SMUD_RATES.tier1 + SMUD_RATES.tier2 + SMUD_RATES.tier3) / 3;
    return (monthlyBill / averageRate) * 12;
}

// Calculate system size needed
function calculateSystemSize(annualUsage, roofSize) {
    // Base system size on annual usage
    let systemSizeKW = annualUsage / (SACRAMENTO_FACTORS.average_sunshine_hours * 365 * SACRAMENTO_FACTORS.panel_efficiency);
    
    // Adjust for roof size constraints
    if (roofSize) {
        const maxSystemSize = roofSize * 0.15; // 15% of roof area can be used for solar
        systemSizeKW = Math.min(systemSizeKW, maxSystemSize);
    }
    
    // Ensure reasonable system size (between 3kW and 15kW)
    systemSizeKW = Math.max(3, Math.min(15, systemSizeKW));
    
    return Math.round(systemSizeKW * 10) / 10; // Round to 1 decimal place
}

// Calculate annual solar production
function calculateAnnualProduction(systemSizeKW) {
    return systemSizeKW * SACRAMENTO_FACTORS.average_sunshine_hours * 365 * SACRAMENTO_FACTORS.panel_efficiency;
}

// Calculate annual savings
function calculateAnnualSavings(annualProduction, annualUsage) {
    // Calculate savings based on SMUD tiered rates
    let savings = 0;
    
    if (annualProduction <= annualUsage * 0.4) {
        // Most savings at tier 1 rate
        savings = annualProduction * SMUD_RATES.tier1;
    } else if (annualProduction <= annualUsage * 0.7) {
        // Mix of tier 1 and tier 2 rates
        const tier1Savings = annualUsage * 0.4 * SMUD_RATES.tier1;
        const tier2Savings = (annualProduction - annualUsage * 0.4) * SMUD_RATES.tier2;
        savings = tier1Savings + tier2Savings;
    } else {
        // Mix of all tiers
        const tier1Savings = annualUsage * 0.4 * SMUD_RATES.tier1;
        const tier2Savings = annualUsage * 0.3 * SMUD_RATES.tier2;
        const tier3Savings = (annualProduction - annualUsage * 0.7) * SMUD_RATES.tier3;
        savings = tier1Savings + tier2Savings + tier3Savings;
    }
    
    return Math.round(savings);
}

// Display calculation results
function displayResults(results) {
    const resultsDiv = document.getElementById('calculator-results');
    
    // Update result values
    document.getElementById('system-size').textContent = `${results.systemSize} kW`;
    document.getElementById('estimated-cost').textContent = `$${results.estimatedCost.toLocaleString()}`;
    document.getElementById('annual-savings').textContent = `$${results.annualSavings.toLocaleString()}`;
    document.getElementById('payback-period').textContent = `${results.paybackPeriod.toFixed(1)} years`;
    
    // Show results with animation
    resultsDiv.style.display = 'block';
    resultsDiv.classList.add('fade-in');
    
    // Add detailed breakdown
    const breakdownHTML = `
        <div class="breakdown">
            <h4>Cost Breakdown</h4>
            <div class="breakdown-item">
                <span>System Cost:</span>
                <span>$${results.grossCost.toLocaleString()}</span>
            </div>
            <div class="breakdown-item">
                <span>Federal Tax Credit (30%):</span>
                <span>-$${results.incentives.federal.toLocaleString()}</span>
            </div>
            <div class="breakdown-item">
                <span>California Rebate (10%):</span>
                <span>-$${results.incentives.california.toLocaleString()}</span>
            </div>
            <div class="breakdown-item">
                <span>SMUD Rebate (5%):</span>
                <span>-$${results.incentives.smud.toLocaleString()}</span>
            </div>
            <div class="breakdown-item total">
                <span>Net Cost:</span>
                <span>$${results.estimatedCost.toLocaleString()}</span>
            </div>
        </div>
    `;
    
    // Add breakdown if it doesn't exist
    if (!document.querySelector('.breakdown')) {
        resultsDiv.querySelector('.result-card').insertAdjacentHTML('beforeend', breakdownHTML);
    }
}

// Form validation
function validateCalculatorForm() {
    const monthlyBill = document.getElementById('monthly-bill').value;
    const roofSize = document.getElementById('roof-size').value;
    
    if (!monthlyBill || monthlyBill <= 0) {
        alert('Please enter a valid monthly electric bill amount.');
        return false;
    }
    
    if (roofSize && roofSize <= 0) {
        alert('Please enter a valid roof size.');
        return false;
    }
    
    return true;
}

// Initialize calculator
document.addEventListener('DOMContentLoaded', function() {
    // Add event listeners
    const calculateBtn = document.querySelector('button[onclick="calculateSavings()"]');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (validateCalculatorForm()) {
                calculateSavings();
            }
        });
    }
    
    // Add input validation
    const inputs = document.querySelectorAll('#monthly-bill, #roof-size');
    inputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    });
});

// Export functions for use in other scripts
window.SolarCalculator = {
    calculateSavings,
    validateCalculatorForm,
    SMUD_RATES,
    SACRAMENTO_FACTORS
};