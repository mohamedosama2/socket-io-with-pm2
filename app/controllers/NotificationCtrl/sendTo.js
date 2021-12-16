const _ = require('lodash');
const $baseCtrl = require('../$baseCtrl');
const models = require('../../models');
const { APIResponse } = require('../../utils');
const nodemailer = require("nodemailer");

// config gmail
const transproter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "bsathalk2020@gmail.com",
        pass: process.env.passGmail,
    },
});

module.exports = $baseCtrl(async (req, res) => {
    let model = req.route.path.split('/')[req.route.path.split('/').length - 1]
    model = model === 'students' ? 'student' : 'teacher'
    // console.log(model)
    let queryUsers = req.body.ids ? { _id: { $in: req.body.ids } } : req.body.class ? { class: req.body.class } : {}
    // console.log(queryUsers)
    let receivers = await models[model].find(queryUsers)
    // return APIResponse.Ok(res, receivers)
    const promises = []
    for (let i = 0; i < receivers.length; i++) {
        let receiver = receivers[i]
        let title = req.body.title;
        let body = req.body.body
        const notification = await models
            .notification({
                title: title,
                body: body,
                initiator: req.me.id,
                receiver: receiver.id,
                subjectType: 'admin',
                subject: req.me.id
            })
            .save();
        const p = receiver.sendNotification(notification.toFirebaseNotification());
        promises.push(p)
        // console.log('receiver', receiver)
        // console.log('notification', notification)

        // send mail
        transproter.sendMail({
            to: receiver.email,
            from: "bsathalk2020@gmail.com",
            subject: title,
            text: body,
        }, (err, info) => {
            // console.log('info', info.accepted);
            // console.log('error', err);
        })
    }
    // console.log('here above promises')
    await Promise.all(promises)

    return APIResponse.Ok(res, 'Send Successfully')

});



/**
 *
 * module.exports = $baseCtrl(async (req, res) => {

    let queryUsers = req.body.class ? { class: req.body.class } : req.body.student_ids ? { _id: { $in: req.body.student_ids } } : {}
    let receivers = await models.student.find(queryUsers)
    // return APIResponse.Ok(res, receivers)

    for (let i = 0; i < receivers.length; i++) {
        let receiver = receivers[i]
        let title = req.body.title;
        let body = req.body.body
        const notification = await models
            .notification({
                title: title,
                body: body,
                initiator: req.me.id,
                receiver: receiver.id,
                subjectType: 'admin',
                subject: req.me.id
            })
            .save();
        await receiver.sendNotification(notification.toFirebaseNotification());
        // console.log('receiver', receiver)
        // console.log('notification', notification)

        // send mail
        transproter.sendMail({
            to: receiver.email,
            from: "bsathalk2020@gmail.com",
            subject: title,
            text: body,
        }, (err, info) => {
            console.log('info', info.accepted);
            console.log('error', err);
        })
    }

    return APIResponse.Ok(res, 'Send Successfully')

});

 */