const mongoose = require("mongoose");

const transactionsSchema = new mongoose.Schema({
    type: {
        type: String,
        required: [true, "النوع مطلوب"],
        enum: {
            values: ["expense", "income"],
            message: "النوع يجب أن يكون إما expense أو income",
        },

    },
    amount: {
        type: Number,
        required: [true, "المبلغ مطلوب"],
        min: [1, "يجب أن يكون المبلغ أكبر من صفر"],
        validate: {
            validator: (val) => Number.isFinite(val),
            message: "المبلغ غير صالح",
        },
    },
    date: {
        type: Date,
        required: [true, "التاريخ مطلوب"],
        validate: {
            validator: function (date) {
                return date <= new Date();
            },
            message: "يجب أن يكون التاريخ أقل من أو يساوي تاريخ اليوم",
        },
    },
    additionalInfo: {
        type: String,
        trim: true,
        maxlength: [500, "المعلومات الإضافية يجب ألا تتعدى 500 حرف"],
    },
    requestID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RequestBuying",
        required: [true, "الطلب مطلوب"],
    },
    employeeID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "الموظف مطلوب"],
    },


}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionsSchema);
