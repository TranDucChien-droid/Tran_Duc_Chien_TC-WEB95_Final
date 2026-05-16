/**
 * @openapi
 * components:
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [user, admin]
 *         createdAt:
 *           type: string
 *           format: date-time
 *     AuthCredentials:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         password:
 *           type: string
 *           minLength: 6
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *         user:
 *           $ref: "#/components/schemas/User"
 *     Quiz:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         createdBy:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *     QuizInput:
 *       type: object
 *       required: [title]
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *     Question:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         quizId:
 *           type: string
 *         question:
 *           type: string
 *         type:
 *           type: string
 *           enum: [single, multiple]
 *         options:
 *           type: array
 *           items:
 *             type: string
 *         correctAnswers:
 *           type: array
 *           items:
 *             type: integer
 *           description: Admin only — omitted for non-admin on GET quiz
 *     QuestionInput:
 *       type: object
 *       required: [question, type, options, correctAnswers]
 *       properties:
 *         question:
 *           type: string
 *         type:
 *           type: string
 *           enum: [single, multiple]
 *         options:
 *           type: array
 *           minItems: 2
 *           items:
 *             type: string
 *         correctAnswers:
 *           type: array
 *           minItems: 1
 *           items:
 *             type: integer
 *             minimum: 0
 *     QuizWithQuestions:
 *       allOf:
 *         - $ref: "#/components/schemas/Quiz"
 *         - type: object
 *           properties:
 *             questions:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Question"
 *     AttemptAnswer:
 *       type: object
 *       required: [questionId, selectedIndexes]
 *       properties:
 *         questionId:
 *           type: string
 *         selectedIndexes:
 *           type: array
 *           items:
 *             type: integer
 *     SubmitAttemptInput:
 *       type: object
 *       required: [quizId, answers]
 *       properties:
 *         quizId:
 *           type: string
 *         answers:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/AttemptAnswer"
 *     AttemptResult:
 *       type: object
 *       properties:
 *         attemptId:
 *           type: string
 *         score:
 *           type: number
 *         correct:
 *           type: integer
 *         total:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date-time
 *     AttemptSummary:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         userId:
 *           type: string
 *         quizId:
 *           type: object
 *           properties:
 *             _id:
 *               type: string
 *             title:
 *               type: string
 *         score:
 *           type: number
 *         createdAt:
 *           type: string
 *           format: date-time
 *     ImportResult:
 *       type: object
 *       properties:
 *         imported:
 *           type: integer
 *         questions:
 *           type: array
 *           items:
 *             $ref: "#/components/schemas/Question"
 */

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Health check
 *     responses:
 *       200:
 *         description: Server is up
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *                   example: true
 */

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags: [Auth]
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthCredentials"
 *     responses:
 *       201:
 *         description: User created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       409:
 *         description: Email already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AuthCredentials"
 *     responses:
 *       200:
 *         description: Authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AuthResponse"
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     tags: [Auth]
 *     summary: Current user profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/User"
 *       401:
 *         description: Not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @openapi
 * /api/quizzes:
 *   get:
 *     tags: [Quizzes]
 *     summary: List all quizzes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quiz list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Quiz"
 *   post:
 *     tags: [Quizzes]
 *     summary: Create quiz (admin)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/QuizInput"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Quiz"
 *       403:
 *         description: Admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @openapi
 * /api/quizzes/{id}:
 *   get:
 *     tags: [Quizzes]
 *     summary: Get quiz with questions
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quiz detail (correctAnswers hidden for non-admin)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/QuizWithQuestions"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *   patch:
 *     tags: [Quizzes]
 *     summary: Update quiz (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/QuizInput"
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Quiz"
 *       403:
 *         description: Admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *   delete:
 *     tags: [Quizzes]
 *     summary: Delete quiz and its questions (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *       403:
 *         description: Admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @openapi
 * /api/quizzes/{quizId}/questions:
 *   post:
 *     tags: [Questions]
 *     summary: Add question to quiz (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/QuestionInput"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Question"
 *       403:
 *         description: Admin only
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *       404:
 *         description: Quiz not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @openapi
 * /api/quizzes/{quizId}/questions/import:
 *   post:
 *     tags: [Questions]
 *     summary: Import questions from Excel (admin)
 *     description: Columns — Question, Type, Option1-4, CorrectAnswers
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: quizId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: .xlsx or .xls file
 *     responses:
 *       201:
 *         description: Imported
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ImportResult"
 *       400:
 *         description: Invalid file or empty sheet
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @openapi
 * /api/questions/{id}:
 *   patch:
 *     tags: [Questions]
 *     summary: Update question (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/QuestionInput"
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Question"
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 *   delete:
 *     tags: [Questions]
 *     summary: Delete question (admin)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok:
 *                   type: boolean
 *       404:
 *         description: Not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @openapi
 * /api/attempts:
 *   post:
 *     tags: [Attempts]
 *     summary: Submit quiz attempt
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SubmitAttemptInput"
 *     responses:
 *       201:
 *         description: Scored attempt
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AttemptResult"
 *       400:
 *         description: Invalid quiz or no questions
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Error"
 */

/**
 * @openapi
 * /api/attempts/me:
 *   get:
 *     tags: [Attempts]
 *     summary: List my attempts
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Attempt history
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/AttemptSummary"
 */
