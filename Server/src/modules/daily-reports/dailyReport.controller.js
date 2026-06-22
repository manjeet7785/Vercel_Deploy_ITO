const dailyReportService = require('./dailyReport.service');
const { ok, fail } = require('../../utils/response');

async function submitDailyReport(req, res, next) {
  try {
    const report = await dailyReportService.submitReport({
      employeeId: req.user._id,
      ...req.body
    });
    return ok(res, { report }, 'Daily report submitted successfully', 201, req);
  } catch (error) {
    next(error);
  }
}

async function getMyReports(req, res, next) {
  try {
    const reports = await dailyReportService.getMyReports(req.user._id);
    return ok(res, { reports }, 'My daily reports retrieved', 200, req);
  } catch (error) {
    next(error);
  }
}

async function getAdminReports(req, res, next) {
  try {
    const { employeeId, startDate, endDate } = req.query;
    const reports = await dailyReportService.getAllReports({ employeeId, startDate, endDate });
    return ok(res, { reports }, 'Admin reports retrieval successful', 200, req);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  submitDailyReport,
  getMyReports,
  getAdminReports
};
