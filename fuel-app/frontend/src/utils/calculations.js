// Calculate mileage (distance per unit of fuel)
export const calculateMileage = (distance, fuelAmount) => {
  if (!fuelAmount || fuelAmount === 0) return 0;
  return (distance / fuelAmount).toFixed(2);
};

// Calculate cost per kilometer/mile
export const calculateCostPerDistance = (totalCost, distance) => {
  if (!distance || distance === 0) return 0;
  return (totalCost / distance).toFixed(2);
};

// Calculate total cost for a vehicle
export const calculateTotalCost = (fuelRecords, vehicleId) => {
  const vehicleRecords = fuelRecords.filter(record => record.vehicleId === vehicleId);
  return vehicleRecords.reduce((sum, record) => sum + parseFloat(record.totalCost), 0);
};

// Calculate average mileage for a vehicle
export const calculateAverageMileage = (fuelRecords, vehicleId) => {
  const vehicleRecords = fuelRecords
    .filter(record => record.vehicleId === vehicleId)
    .sort((a, b) => a.odometer - b.odometer); // Must be sorted for distance calculation

  if (vehicleRecords.length < 2) return 0;

  let totalMileage = 0;
  let count = 0;

  for (let i = 1; i < vehicleRecords.length; i++) {
    const distance = vehicleRecords[i].odometer - vehicleRecords[i - 1].odometer;
    if (distance > 0) {
      const mileage = calculateMileage(distance, vehicleRecords[i].fuelAmount);
      totalMileage += parseFloat(mileage);
      count++;
    }
  }

  return count > 0 ? (totalMileage / count).toFixed(2) : 0;
};

// Get monthly expenses
export const getMonthlyExpenses = (fuelRecords, vehicleId = null) => {
  const records = vehicleId 
    ? fuelRecords.filter(record => record.vehicleId === vehicleId)
    : fuelRecords;

  const monthlyData = {};

  records.forEach(record => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = 0;
    }
    monthlyData[monthKey] += parseFloat(record.totalCost);
  });

  return monthlyData;
};

// Get last 6 months data for charts
export const getLast6MonthsData = (fuelRecords, vehicleId = null) => {
  const monthlyExpenses = getMonthlyExpenses(fuelRecords, vehicleId);
  const months = [];
  const values = [];
  
  const currentDate = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const monthName = date.toLocaleDateString('en-US', { month: 'short' });
    
    months.push(monthName);
    values.push(monthlyExpenses[monthKey] || 0);
  }

  return { months, values };
};

// Calculate statistics for a vehicle
export const calculateVehicleStats = (fuelRecords, vehicleId) => {
  const vehicleRecords = fuelRecords.filter(record => record.vehicleId === vehicleId);
  
  if (vehicleRecords.length === 0) {
    return {
      totalExpenses: 0,
      totalFuel: 0,
      totalDistance: 0,
      averageMileage: 0,
      avgCostPerFill: 0,
      recordCount: 0,
    };
  }

  const sortedRecords = [...vehicleRecords].sort((a, b) => a.odometer - b.odometer);
  const totalExpenses = vehicleRecords.reduce((sum, r) => sum + parseFloat(r.totalCost), 0);
  const totalFuel = vehicleRecords.reduce((sum, r) => sum + parseFloat(r.fuelAmount), 0);
  const totalDistance = sortedRecords.length > 1 
    ? sortedRecords[sortedRecords.length - 1].odometer - sortedRecords[0].odometer 
    : 0;

  return {
    totalExpenses: totalExpenses.toFixed(2),
    totalFuel: totalFuel.toFixed(2),
    totalDistance: totalDistance.toFixed(2),
    averageMileage: calculateAverageMileage(vehicleRecords, vehicleId), // Passes only the filtered records
    avgCostPerFill: (totalExpenses / vehicleRecords.length).toFixed(2),
    recordCount: vehicleRecords.length,
  };
};

// Format currency
export const formatCurrency = (amount) => {
  return `$${parseFloat(amount).toFixed(2)}`;
};

// Generate CSV data
export const generateCSVData = (fuelRecords, vehicles) => {
  let csv = 'Date,Vehicle,Fuel Amount,Price per Unit,Total Cost,Odometer,Mileage\n';
  
  const sortedRecords = [...fuelRecords].sort((a, b) => new Date(b.date) - new Date(a.date));
  
  sortedRecords.forEach(record => {
    const vehicle = vehicles.find(v => v.id === record.vehicleId);
    const vehicleName = vehicle ? vehicle.name : 'Unknown';
    const date = new Date(record.date).toLocaleDateString();
    
    csv += `${date},${vehicleName},${record.fuelAmount},${record.pricePerUnit},${record.totalCost},${record.odometer},${record.mileage || 'N/A'}\n`;
  });
  
  return csv;
};
