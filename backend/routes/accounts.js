const express = require("express");
const AccountRouter = express.Router();
const { User, Account } = require("../db");
const { Authmiddlewere } = require("../middlewere")
const mongoose = require("mongoose");

AccountRouter.get('/balance', Authmiddlewere, async (req, res) => {
    const UserAccount = await Account.findOne({
        userId: req.userId
    })
    res.json({
        balance: UserAccount.balance
    })
})

AccountRouter.post("/transfer", Authmiddlewere, async (req, res) => {
    const { amount, to } = req.body;

    const account = await Account.findOne({
        userId: req.userId
    });

    if (account.balance < amount) {
        return res.status(400).json({
            message: "Insufficient balance"
        })
    }

    const toAccount = await Account.findOne({
        userId: to
    });

    if (!toAccount) {
        return res.status(400).json({
            message: "Invalid account"
        })
    }

    await Account.updateOne({
        userId: req.userId
    }, {
        $inc: {
            balance: -amount
        }
    })

    await Account.updateOne({
        userId: to
    }, {
        $inc: {
            balance: amount
        }
    })

    res.json({
        message: "Transfer successful"
    })
});


module.exports = AccountRouter;

