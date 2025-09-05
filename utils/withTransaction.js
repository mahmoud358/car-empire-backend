
const mongoose = require("mongoose");
const APIERROR = require("./apiError");

const withTransaction = async (callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const result = await callback(session); // تمرر العمليات هنا
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw new APIERROR(error.statusCode || 400, error.message);
  } finally {
    session.endSession();
  }
};

module.exports = withTransaction;
