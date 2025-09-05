const loginLogModel = require("../models/loginLog");

async function createLoginLog(userId, data) {
  await loginLogModel.create({
    userId,
    country: data.country,
    city: data.city,
    ip: data.ip,
    browser: data.browser,
    latitude: data.latitude,
    longitude: data.longitude,
  });
}
module.exports = { createLoginLog };