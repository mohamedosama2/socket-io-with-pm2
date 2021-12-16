const express = require('express');
const { APIResponse } = require('../utils');
const apiV1Router = require('./api.js');
// const passport = require('passport')
// require('../services/passport')
// const jwt = require('jsonwebtoken');
// [TODO] fix Unauthorized instead of Not Found bug
// Proposed solution: inject `isAuthenticated` policy after routes instead of before

let router = express.Router();
router.use('/uploads', express.static('/uploads')); // static uploaded files (media)
router.use('/api/v1', apiV1Router);
router.use((req, res, next) => {
    return APIResponse.NotFound(res);
});

module.exports = router;
