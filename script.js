let selectedForm = '';

function selectSurvey(formType) {
  hideAll();
  selectedForm = formType;
  if (formType === 'household') {
    document.getElementById('householdForm').classList.remove('hidden');
  } else {
    document.getElementById('officeForm').classList.remove('hidden');
  }
}

function submitHousehold() {
  const name = document.getElementById('fullName').value;
  const location = document.getElementById('location').value;
  const month = document.getElementById('surveyMonth').value;
  const electricity = parseFloat(document.getElementById('electricity').value) || 0;
  const transport = parseFloat(document.getElementById('transport').value) || 0;
  const waste = parseFloat(document.getElementById('waste').value) || 0;
  const lpg = parseFloat(document.getElementById('lpg').value) || 0;
  
  const emissions = calculateEmissions(electricity, transport, waste, lpg);
  showResults(name, location, month, emissions, 'Household');
}

function submitOffice() {
  const name = document.getElementById('officeName').value;
  const location = document.getElementById('officeLocation').value;
  const month = document.getElementById('officeSurveyMonth').value;
  const electricity = parseFloat(document.getElementById('officeElectricity').value) || 0;
  const transport = parseFloat(document.getElementById('officeTransport').value) || 0;
  const waste = parseFloat(document.getElementById('officeWaste').value) || 0;
  
  const emissions = calculateEmissions(electricity, transport, waste, 0);
  showResults(name, location, month, emissions, 'Office');
}

function calculateEmissions(electricity, transport, waste, lpg) {
  return {
    electricity: electricity * 0.82,
    transport: transport * 0.12,
    waste: waste * 4.5,
    lpg: lpg * 35,
    total: (electricity * 0.82) + (transport * 0.12) + (waste * 4.5) + (lpg * 35)
  };
}

function showResults(name, location, month, emissions, type) {
  hideAll();
  document.getElementById('results').classList.remove('hidden');
  
  document.getElementById('resultTitle').innerText = `${type} Emissions for ${formatMonth(month)}`;
  
  document.getElementById('resultTable').innerHTML = `
    <tr><th>Category</th><th>Details</th></tr>
    <tr><td>Name</td><td>${name}</td></tr>
    <tr><td>Location</td><td>${location}</td></tr>
    <tr><td>Electricity Emissions (kg CO₂e)</td><td>${emissions.electricity.toFixed(2)}</td></tr>
    <tr><td>Transport Emissions (kg CO₂e)</td><td>${emissions.transport.toFixed(2)}</td></tr>
    <tr><td>Waste Emissions (kg CO₂e)</td><td>${emissions.waste.toFixed(2)}</td></tr>
    ${type === 'Household' ? `<tr><td>LPG Emissions (kg CO₂e)</td><td>${emissions.lpg.toFixed(2)}</td></tr>` : ''}
    <tr><td><strong>Total Emissions</strong></td><td><strong>${emissions.total.toFixed(2)}</strong></td></tr>
  `;

  const ctx = document.getElementById('emissionsChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: type === 'Household' ? ['Electricity', 'Transport', 'Waste', 'LPG'] : ['Electricity', 'Transport', 'Waste'],
      datasets: [{
        data: type === 'Household' ? [emissions.electricity, emissions.transport, emissions.waste, emissions.lpg] : [emissions.electricity, emissions.transport, emissions.waste],
        backgroundColor: ['#4caf50', '#2196f3', '#ff9800', '#9c27b0']
      }]
    },
    options: { responsive: true }
  });

  document.getElementById('scopeDetails').innerHTML = `
    <h3>Scope-wise Breakdown</h3>
    <p>Scope 1 (Direct - LPG if any): ${type === 'Household' ? emissions.lpg.toFixed(2) : 0} kg CO₂e</p>
    <p>Scope 2 (Electricity): ${emissions.electricity.toFixed(2)} kg CO₂e</p>
    <p>Scope 3 (Transport + Waste): ${(emissions.transport + emissions.waste).toFixed(2)} kg CO₂e</p>
  `;

  document.getElementById('observations').innerHTML = `
    <h3>Observations</h3>
    <p>Your main sources of emissions are from ${emissions.electricity > emissions.transport ? "Electricity" : "Transport"} usage.</p>
  `;

  document.getElementById('recommendations').innerHTML = `
    <h3>Recommendations</h3>
    <ul>
      <li>Switch to renewable energy sources and efficient appliances.</li>
      <li>Carpool, use EVs, or take public transport more often.</li>
      <li>Recycle waste and avoid sending waste to landfills.</li>
    </ul>
  `;
}

function formatMonth(monthStr) {
  return monthStr ? new Date(monthStr + '-01').toLocaleString('default', { month: 'long', year: 'numeric' }) : 'Selected Month';
}

function goHome() {
  hideAll();
  document.getElementById('homePage').classList.remove('hidden');
}

function hideAll() {
  document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
}
