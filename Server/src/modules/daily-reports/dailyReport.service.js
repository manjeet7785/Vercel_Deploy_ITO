const DailyReport = require('./dailyReport.model');

async function submitReport({ employeeId, completedWork, callsMade, followupsCompleted, hotLeadsHandled, pendingWork, problemsEncountered, tomorrowPlan }) {
  
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  
  return DailyReport.findOneAndUpdate(
    { employeeId, date: { $gte: startOfDay } },
    {
      employeeId,
      completedWork,
      callsMade: callsMade || 0,
      followupsCompleted: followupsCompleted || 0,
      hotLeadsHandled: hotLeadsHandled || 0,
      pendingWork,
      problemsEncountered,
      tomorrowPlan,
      date: new Date()
    },
    { upsert: true, new: true }
  );
}

async function getMyReports(employeeId) {
  return DailyReport.find({ employeeId }).sort({ date: -1 });
}

async function getAllReports(filter = {}) {
  const query = {};
  if (filter.employeeId) query.employeeId = filter.employeeId;
  if (filter.startDate && filter.endDate) {
    query.date = {
      $gte: new Date(filter.startDate),
      $lte: new Date(filter.endDate)
    };
  }
  return DailyReport.find(query).populate('employeeId', 'fullName email employeeId department').sort({ date: -1 });
}

module.exports = {
  submitReport,
  getMyReports,
  getAllReports
};
