const express = require("express");
const router = express.Router();
const { auth, restrictTo } = require("../middlewares/auth");
const userRole = require("../utils/user-roles");
const reqBuyong=require("../controllers/requestBuying");
const {validateRequest}=require("../middlewares/validateRequestBuying");

/**
 * @swagger
 * components:
 *   schemas:
 *     RequestBuying:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: Request ID
 *         requestNum:
 *           type: number
 *           description: Auto-generated request number
 *         type:
 *           type: string
 *           enum: [corporate-finance, personal-finance, cash]
 *           description: Type of buying request
 *         status:
 *           type: string
 *           enum: [pending, processing, approval, rejected]
 *           description: Request status
 *         employeeId:
 *           type: string
 *           description: Assigned employee ID
 *         supplierId:
 *           type: string
 *           description: Supplier ID
 *         FinancingEntity:
 *           type: string
 *           description: Financing entity
 *         sellingPrice:
 *           type: number
 *           minimum: 1000
 *           description: Selling price
 *         buyingPrice:
 *           type: number
 *           minimum: 1000
 *           description: Buying price
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Full name
 *         phoneNumber:
 *           type: array
 *           items:
 *             type: string
 *             pattern: '^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$'
 *           description: Phone numbers
 *         city:
 *           type: string
 *           description: City
 *         car:
 *           type: object
 *           properties:
 *             brand:
 *               type: string
 *               description: Car brand
 *             model:
 *               type: string
 *               description: Car model
 *             category:
 *               type: string
 *               description: Car category
 *         idCard:
 *           type: string
 *           format: uri
 *           pattern: '^https?://.+\\.(jpg|jpeg|png|webp)$'
 *           description: ID card image URL
 *         drivingLicense:
 *           type: string
 *           format: uri
 *           pattern: '^https?://.+\\.(jpg|jpeg|png|webp)$'
 *           description: Driving license image URL
 *         salaryStatement:
 *           type: string
 *           format: uri
 *           pattern: '^https?://.+\\.(jpg|jpeg|png|webp)$'
 *           description: Salary statement image URL
 *         companyData:
 *           type: object
 *           properties:
 *             companyName:
 *               type: string
 *               minLength: 3
 *               maxLength: 150
 *               description: Company name
 *             commercialRegister:
 *               type: string
 *               minLength: 5
 *               pattern: '^[0-9]{5,}$'
 *               description: Commercial register number
 *             email:
 *               type: string
 *               format: email
 *               pattern: '^[a-zA-Z0-9._%+-]+@(gmail\\.com|outlook\\.com)$'
 *               description: Company email
 *             activity:
 *               type: string
 *               description: Company activity
 *             companyType:
 *               type: string
 *               description: Company type
 *             branchesNumber:
 *               type: number
 *               minimum: 0
 *               description: Number of branches
 *             carsNumber:
 *               type: number
 *               minimum: 0
 *               description: Number of cars
 *             establishmentDate:
 *               type: string
 *               format: date
 *               description: Establishment date
 *             mainBank:
 *               type: string
 *               description: Main bank
 *             hasLeasing:
 *               type: boolean
 *               description: Has leasing
 *             leasingBank:
 *               type: string
 *               description: Leasing bank
 *             notes:
 *               type: string
 *               description: Notes
 *         personalData:
 *           type: object
 *           properties:
 *             salary:
 *               type: number
 *               minimum: 1000
 *               description: Salary
 *             salaryMethod:
 *               type: string
 *               description: Salary payment method
 *             Nationality:
 *               type: string
 *               enum: [سعودى, غير سعودى]
 *               description: Nationality
 *             employer:
 *               type: string
 *               description: Employer
 *             financialObligations:
 *               type: boolean
 *               description: Has financial obligations
 *             VisacreditLimit:
 *               type: number
 *               minimum: 100
 *               description: Visa credit limit
 *             personalLoan:
 *               type: number
 *               minimum: 100
 *               description: Personal loan amount
 *             carLoan:
 *               type: number
 *               minimum: 100
 *               description: Car loan amount
 *             mortgageLoan:
 *               type: string
 *               enum: [notFound, supported, notsupported]
 *               description: Mortgage loan status
 *             InstallmentValue:
 *               type: number
 *               minimum: 100
 *               description: Installment value
 *             SupportValue:
 *               type: number
 *               minimum: 100
 *               description: Support value
 *             violations:
 *               type: number
 *               minimum: 0
 *               description: Number of violations
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *     CorporateFinanceRequest:
 *       type: object
 *       required: [type, fullName, phoneNumber, city, companyData]
 *       properties:
 *         type:
 *           type: string
 *           enum: [corporate-finance]
 *           description: Request type
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Full name
 *         phoneNumber:
 *           type: array
 *           items:
 *             type: string
 *             pattern: '^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$'
 *           minItems: 1
 *           description: Phone numbers
 *         city:
 *           type: string
 *           description: City
 *         companyData:
 *           type: object
 *           required: [companyName, commercialRegister, activity, companyType, establishmentDate, mainBank, hasLeasing]
 *           properties:
 *             companyName:
 *               type: string
 *               minLength: 3
 *               maxLength: 150
 *               description: Company name
 *             commercialRegister:
 *               type: string
 *               minLength: 5
 *               pattern: '^[0-9]{5,}$'
 *               description: Commercial register number
 *             email:
 *               type: string
 *               format: email
 *               pattern: '^[a-zA-Z0-9._%+-]+@(gmail\\.com|outlook\\.com)$'
 *               description: Company email
 *             activity:
 *               type: string
 *               description: Company activity
 *             companyType:
 *               type: string
 *               description: Company type
 *             branchesNumber:
 *               type: number
 *               minimum: 0
 *               description: Number of branches
 *             carsNumber:
 *               type: number
 *               minimum: 0
 *               description: Number of cars
 *             establishmentDate:
 *               type: string
 *               format: date
 *               description: Establishment date
 *             mainBank:
 *               type: string
 *               description: Main bank
 *             hasLeasing:
 *               type: boolean
 *               description: Has leasing
 *             leasingBank:
 *               type: string
 *               description: Leasing bank (required if hasLeasing is true)
 *             notes:
 *               type: string
 *               description: Notes
 *     PersonalFinanceRequest:
 *       type: object
 *       required: [type, fullName, phoneNumber, city, car, idCard, drivingLicense, salaryStatement, personalData]
 *       properties:
 *         type:
 *           type: string
 *           enum: [personal-finance]
 *           description: Request type
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Full name
 *         phoneNumber:
 *           type: array
 *           items:
 *             type: string
 *             pattern: '^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$'
 *           minItems: 1
 *           description: Phone numbers
 *         city:
 *           type: string
 *           description: City
 *         car:
 *           type: object
 *           required: [brand, model, category]
 *           properties:
 *             brand:
 *               type: string
 *               description: Car brand
 *             model:
 *               type: string
 *               description: Car model
 *             category:
 *               type: string
 *               description: Car category
 *         idCard:
 *           type: string
 *           format: uri
 *           pattern: '^https?://.+\\.(jpg|jpeg|png|webp)$'
 *           description: ID card image URL
 *         drivingLicense:
 *           type: string
 *           format: uri
 *           pattern: '^https?://.+\\.(jpg|jpeg|png|webp)$'
 *           description: Driving license image URL
 *         salaryStatement:
 *           type: string
 *           format: uri
 *           pattern: '^https?://.+\\.(jpg|jpeg|png|webp)$'
 *           description: Salary statement image URL
 *         personalData:
 *           type: object
 *           required: [salary, salaryMethod, Nationality, employer, financialObligations]
 *           properties:
 *             salary:
 *               type: number
 *               minimum: 1000
 *               description: Salary
 *             salaryMethod:
 *               type: string
 *               description: Salary payment method
 *             Nationality:
 *               type: string
 *               enum: [سعودى, غير سعودى]
 *               description: Nationality
 *             employer:
 *               type: string
 *               description: Employer
 *             financialObligations:
 *               type: boolean
 *               description: Has financial obligations
 *             VisacreditLimit:
 *               type: number
 *               minimum: 100
 *               description: Visa credit limit
 *             personalLoan:
 *               type: number
 *               minimum: 100
 *               description: Personal loan amount
 *             carLoan:
 *               type: number
 *               minimum: 100
 *               description: Car loan amount
 *             mortgageLoan:
 *               type: string
 *               enum: [notFound, supported, notsupported]
 *               description: Mortgage loan status
 *             InstallmentValue:
 *               type: number
 *               minimum: 100
 *               description: Installment value
 *             SupportValue:
 *               type: number
 *               minimum: 100
 *               description: Support value
 *             violations:
 *               type: number
 *               minimum: 0
 *               default: 0
 *               description: Number of violations
 *     CashRequest:
 *       type: object
 *       required: [type, fullName, phoneNumber, city, car]
 *       properties:
 *         type:
 *           type: string
 *           enum: [cash]
 *           description: Request type
 *         fullName:
 *           type: string
 *           minLength: 3
 *           maxLength: 100
 *           description: Full name
 *         phoneNumber:
 *           type: array
 *           items:
 *             type: string
 *             pattern: '^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$'
 *           minItems: 1
 *           description: Phone numbers
 *         city:
 *           type: string
 *           description: City
 *         car:
 *           type: object
 *           required: [brand, model, category]
 *           properties:
 *             brand:
 *               type: string
 *               description: Car brand
 *             model:
 *               type: string
 *               description: Car model
 *             category:
 *               type: string
 *               description: Car category
 *     AssignEmployeeRequest:
 *       type: object
 *       required: [employeeId]
 *       properties:
 *         employeeId:
 *           type: string
 *           description: Employee ID to assign the request to
 *     ApiResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success, fail]
 *           description: Response status
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           description: Response data
 *     PaginationResponse:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           enum: [success]
 *           description: Response status
 *         message:
 *           type: string
 *           description: Response message
 *         data:
 *           type: object
 *           properties:
 *             requests:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RequestBuying'
 *               description: List of requests
 *             statusData:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Status name
 *                   count:
 *                     type: number
 *                     description: Number of requests with this status
 *               description: Status statistics
 *         pagination:
 *           type: object
 *           properties:
 *             currentPage:
 *               type: number
 *               description: Current page number
 *             totalPages:
 *               type: number
 *               description: Total number of pages
 *             totalItems:
 *               type: number
 *               description: Total number of items
 */

/**
 * @swagger
 * /request-buying/add:
 *   post:
 *     summary: Create a new buying request
 *     description: Create a new buying request with validation based on request type (corporate-finance, personal-finance, or cash)
 *     tags: [Request Buying]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/CorporateFinanceRequest'
 *               - $ref: '#/components/schemas/PersonalFinanceRequest'
 *               - $ref: '#/components/schemas/CashRequest'
 *           examples:
 *             corporate-finance:
 *               summary: Corporate Finance Request
 *               value:
 *                 type: "corporate-finance"
 *                 fullName: "أحمد محمد العلي"
 *                 phoneNumber: ["0501234567", "966501234567"]
 *                 city: "الرياض"
 *                 companyData:
 *                   companyName: "شركة النقل الحديث"
 *                   commercialRegister: "1234567890"
 *                   email: "info@company.com"
 *                   activity: "النقل والمواصلات"
 *                   companyType: "شركة محدودة"
 *                   branchesNumber: 5
 *                   carsNumber: 50
 *                   establishmentDate: "2020-01-01"
 *                   mainBank: "البنك الأهلي"
 *                   hasLeasing: true
 *                   leasingBank: "بنك الراجحي"
 *                   notes: "ملاحظات إضافية"
 *             personal-finance:
 *               summary: Personal Finance Request
 *               value:
 *                 type: "personal-finance"
 *                 fullName: "سارة أحمد السعد"
 *                 phoneNumber: ["0509876543"]
 *                 city: "جدة"
 *                 car:
 *                   brand: "Toyota"
 *                   model: "Camry 2023"
 *                   category: "Sedan"
 *                 idCard: "https://example.com/id-card.jpg"
 *                 drivingLicense: "https://example.com/license.jpg"
 *                 salaryStatement: "https://example.com/salary.jpg"
 *                 personalData:
 *                   salary: 8000
 *                   salaryMethod: "bank"
 *                   Nationality: "سعودى"
 *                   employer: "شركة التقنية المتقدمة"
 *                   financialObligations: false
 *                   violations: 0
 *             cash:
 *               summary: Cash Purchase Request
 *               value:
 *                 type: "cash"
 *                 fullName: "محمد عبدالله القحطاني"
 *                 phoneNumber: ["0505555555"]
 *                 city: "الدمام"
 *                 car:
 *                   brand: "Honda"
 *                   model: "Civic 2023"
 *                   category: "Sedan"
 *     responses:
 *       201:
 *         description: Request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RequestBuying'
 *             example:
 *               status: "success"
 *               message: "تم انشاء الطلب بنجاح"
 *               data:
 *                 _id: "64a1b2c3d4e5f6789abcdef0"
 *                 requestNum: 1001
 *                 type: "personal-finance"
 *                 status: "pending"
 *                 fullName: "سارة أحمد السعد"
 *                 phoneNumber: ["0509876543"]
 *                 city: "جدة"
 *                 createdAt: "2023-07-01T10:00:00.000Z"
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *             example:
 *               success: "fail"
 *               message: ["الاسم يجب أن يكون 3 أحرف على الأقل", "رقم الهاتف غير صالح"]
 */
router.post("/add",validateRequest, reqBuyong.createRequestBuying);

/**
 * @swagger
 * /request-buying/phone/num/{phoneNumber}:
 *   get:
 *     summary: Get requests by phone number
 *     description: Retrieve paginated requests that contain the provided phone number.
 *     tags: [Request Buying]
 *     parameters:
 *       - in: path
 *         name: phoneNumber
 *         required: true
 *         schema:
 *           type: string
 *         description: Phone number to search for (e.g. 0501234567)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Requests fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     requests:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/RequestBuying'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     currentPage:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                     totalItems:
 *                       type: integer
 */
router.get("/phone/num/:phoneNumber",reqBuyong.getAllRequestBuyingByPhone);

/**
 * @swagger
 * /request-buying/numbers:
 *   get:
 *     summary: Get counts of requests grouped by type and status
 *     description: Returns aggregated counts of requests grouped by type and status.
 *     tags: [Request Buying]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Counts fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       status:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             count:
 *                               type: integer
 *                       type:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             _id:
 *                               type: string
 *                             count:
 *                               type: integer
 */
router.get("/numbers",auth,restrictTo(userRole.ADMIN,userRole.SUPERVISOR,userRole.EMPLOYEE),reqBuyong.getNumsOfTypeAndStatus);

/**
 * @swagger
 * /request-buying/all/{type}:
 *   get:
 *     summary: Get all buying requests by type
 *     description: Retrieve all buying requests filtered by type with pagination and status statistics
 *     tags: [Request Buying]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [corporate-finance, personal-finance, cash]
 *         description: Type of buying requests to retrieve
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, approval, rejected]
 *         description: Filter by request status
 *       - in: query
 *         name: employeeId
 *         schema:
 *           type: string
 *         description: Filter by assigned employee ID
 *       - in: query
 *         name: requestNum
 *         schema:
 *           type: integer
 *         description: Filter by request number
 *       - in: query
 *         name: fullName
 *         schema:
 *           type: string
 *         description: Filter by full name
 *       - in: query
 *         name: FinancingEntity
 *         schema:
 *           type: string
 *         description: Filter by financing entity
 *       - in: query
 *         name: minCreatedAt
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by minimum creation date
 *       - in: query
 *         name: maxCreatedAt
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by maximum creation date
 *       - in: query
 *         name: phoneNumber
 *         schema:
 *           type: string
 *           pattern: '^(009665|9665|\\+9665|05|5)(5|0|3|6|4|9|1|8|7)([0-9]{7})$'
 *         description: Filter by phone number
 *     responses:
 *       200:
 *         description: Requests retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginationResponse'
 *             example:
 *               status: "success"
 *               message: "تم جلب جميع الطلبات بنجاح"
 *               data:
 *                 requests:
 *                   - _id: "64a1b2c3d4e5f6789abcdef0"
 *                     requestNum: 1001
 *                     type: "personal-finance"
 *                     status: "pending"
 *                     fullName: "سارة أحمد السعد"
 *                     phoneNumber: ["0509876543"]
 *                     city: "جدة"
 *                     createdAt: "2023-07-01T10:00:00.000Z"
 *                 statusData:
 *                   - _id: "pending"
 *                     count: 5
 *                   - _id: "processing"
 *                     count: 3
 *               pagination:
 *                 currentPage: 1
 *                 totalPages: 2
 *                 totalItems: 15
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 */
router.get("/all/:type",auth,restrictTo(userRole.ADMIN,userRole.SUPERVISOR,userRole.EMPLOYEE),reqBuyong.getAllRequestBuyingByType);

/**
 * @swagger
 * /request-buying/{id}:
 *   get:
 *     summary: Get buying request by ID
 *     description: Retrieve a specific buying request by its ID along with related comments, suppliers, and transactions
 *     tags: [Request Buying]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     responses:
 *       200:
 *         description: Request retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     request:
 *                       $ref: '#/components/schemas/RequestBuying'
 *                     commentsData:
 *                       type: object
 *                       properties:
 *                         comments:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Comment'
 *                         totalItems:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                     suppliersData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           name:
 *                             type: string
 *                     expensesData:
 *                       type: object
 *                       properties:
 *                         transactions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Transaction'
 *                         totalItems:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *                     incomesData:
 *                       type: object
 *                       properties:
 *                         transactions:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Transaction'
 *                         totalItems:
 *                           type: integer
 *                         totalPages:
 *                           type: integer
 *             example:
 *               status: "success"
 *               message: "تم جلب الطلب بنجاح"
 *               data:
 *                 request:
 *                   _id: "64a1b2c3d4e5f6789abcdef0"
 *                   requestNum: 1001
 *                   type: "personal-finance"
 *                   status: "pending"
 *                   fullName: "سارة أحمد السعد"
 *                   phoneNumber: ["0509876543"]
 *                   city: "جدة"
 *                 commentsData:
 *                   comments:
 *                     - _id: "64a1b2c3d4e5f6789abcdea1"
 *                       text: "تم التواصل مع العميل"
 *                       userId: "64a1b2c3d4e5f6789abcde11"
 *                       requestId: "64a1b2c3d4e5f6789abcdef0"
 *                       createdAt: "2023-07-01T10:10:00.000Z"
 *                   totalItems: 1
 *                   totalPages: 1
 *                 suppliersData:
 *                   suppliers:
 *                     - _id: "64a1b2c3d4e5f6789abcdef1"
 *                       name: "وكالة تويوتا"
 *                       funding: ['بنك الراجحي','بنك البلاد']
 *                   totalItems: 1
 *                   totalPages: 1
 *                 expensesData:
 *                   transactions:
 *                     - _id: "64a1b2c3d4e5f6789abcde21"
 *                       type: "expense"
 *                       amount: 2500
 *                       date: "2023-07-01"
 *                       requestID: "64a1b2c3d4e5f6789abcdef0"
 *                   totalItems: 1
 *                   totalPages: 1
 *                 incomesData:
 *                   transactions:
 *                     - _id: "64a1b2c3d4e5f6789abcde31"
 *                       type: "income"
 *                       amount: 5000
 *                       date: "2023-07-01"
 *                       requestID: "64a1b2c3d4e5f6789abcdef0"
 *                   totalItems: 1
 *                   totalPages: 1
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Request not found
 */
router.get("/:id",auth,restrictTo(userRole.ADMIN,userRole.SUPERVISOR,userRole.EMPLOYEE),reqBuyong.getRequestBuyingByID);

/**
 * @swagger
 * /request-buying/{id}:
 *   patch:
 *     summary: Assign request to employee
 *     description: Assign a buying request to a specific employee and change status to processing
 *     tags: [Request Buying]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignEmployeeRequest'
 *           example:
 *             employeeId: "64a1b2c3d4e5f6789abcdef2"
 *     responses:
 *       200:
 *         description: Request assigned successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RequestBuying'
 *             example:
 *               status: "success"
 *               message: "تم تخصيص الطلب بنجاح"
 *               data:
 *                 _id: "64a1b2c3d4e5f6789abcdef0"
 *                 requestNum: 1001
 *                 type: "personal-finance"
 *                 status: "processing"
 *                 employeeId: "64a1b2c3d4e5f6789abcdef2"
 *                 fullName: "سارة أحمد السعد"
 *                 phoneNumber: ["0509876543"]
 *                 city: "جدة"
 *                 updatedAt: "2023-07-01T11:00:00.000Z"
 *       400:
 *         description: Bad request - Missing employee ID or validation error
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Request not found
 */
router.patch("/:id",auth,restrictTo(userRole.ADMIN,userRole.SUPERVISOR),reqBuyong.AssignRequestToEmployee);

/**
 * @swagger
 * /request-buying/update/{id}:
 *   patch:
 *     summary: Update buying request
 *     description: Update a buying request with validation based on user role and request status
 *     tags: [Request Buying]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/CorporateFinanceRequest'
 *               - $ref: '#/components/schemas/PersonalFinanceRequest'
 *               - $ref: '#/components/schemas/CashRequest'
 *           example:
 *             status: "approval"
 *             supplierId: "64a1b2c3d4e5f6789abcdef3"
 *             sellingPrice: 150000
 *             buyingPrice: 140000
 *             FinancingEntity: "البنك الأهلي"
 *             notes: "تم الموافقة على الطلب"
 *     responses:
 *       200:
 *         description: Request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/RequestBuying'
 *             example:
 *               status: "success"
 *               message: "تم تحديث الطلب بنجاح"
 *               data:
 *                 _id: "64a1b2c3d4e5f6789abcdef0"
 *                 requestNum: 1001
 *                 type: "personal-finance"
 *                 status: "approval"
 *                 supplierId: "64a1b2c3d4e5f6789abcdef3"
 *                 sellingPrice: 150000
 *                 buyingPrice: 140000
 *                 FinancingEntity: "البنك الأهلي"
 *                 fullName: "سارة أحمد السعد"
 *                 phoneNumber: ["0509876543"]
 *                 city: "جدة"
 *                 updatedAt: "2023-07-01T12:00:00.000Z"
 *       400:
 *         description: Bad request - Validation error or insufficient permissions
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Request not found
 */
router.patch("/update/:id",auth,restrictTo(userRole.ADMIN,userRole.SUPERVISOR,userRole.EMPLOYEE),reqBuyong.updateRequestBuying);

module.exports=router;

