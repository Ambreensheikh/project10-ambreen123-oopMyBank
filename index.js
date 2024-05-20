#! /usr/bin/env node
import inquirer from "inquirer";
import { faker } from "@faker-js/faker";
import chalk from "chalk";
//customer,s class
class Customer {
    firstName;
    lastName;
    age;
    mobileNo;
    gender;
    accountNo;
    constructor(fName, lName, mobNo, age, gender, accountNo) {
        this.firstName = fName;
        this.lastName = lName;
        this.mobileNo = mobNo;
        this.age = age;
        this.gender = gender;
        this.accountNo = accountNo;
    }
}
//Bank class
class Bank {
    customer = [];
    account = [];
    addCustomer(obj) {
        this.customer.push(obj);
    }
    addAccountNumber(obj) {
        this.account.push(obj);
    }
    transaction(accObj) {
        let newAccount = this.account.filter((acc) => acc.accountNo !== accObj.accountNo);
        this.account = [...newAccount, accObj];
    }
}
let myBank = new Bank();
//console.log(myBank);
//customer creator
for (let i = 1; i <= 3; i++) {
    let fName = faker.person.firstName('male');
    let lName = faker.person.lastName();
    let num = parseInt(faker.phone.number("3#########"));
    const cus = new Customer(fName, lName, num, 20 * i, "male", 1000 + i);
    myBank.addCustomer(cus);
    myBank.addAccountNumber({ accountNo: cus.accountNo, balance: 1000 * i });
    // console.log(cus);
}
//console.log(myBank);
async function bankService(bank) {
    let service = await inquirer.prompt({
        name: "select",
        type: "list",
        message: "Please ! select the service",
        choices: ["View Balance", "Cash Withdraw", "Cash Deposit"]
    });
    //View Balance
    if (service.select == "View Balance") {
        let ans = await inquirer.prompt({
            name: "num",
            type: "input",
            message: "Please ! Enter your account number ."
        });
        let account = myBank.account.find((acc) => acc.accountNo == ans.num);
        if (!account) {
            console.log(chalk.red.bold("Invalid Account Number !"));
        }
        if (account) {
            let name = myBank.customer.find((item) => item.accountNo == account?.accountNo);
            console.log(`Dear ${chalk.green.bold(name?.firstName)}  ${chalk.green.bold(name?.lastName)}
         Your account Balance is ${chalk.green.bold(account.balance)} $`);
        }
    }
    //Cash Wiyhdraw
    if (service.select == "Cash Withdraw") {
        let ans = await inquirer.prompt({
            name: "num",
            type: "input",
            message: "Please ! Enter your account number ."
        });
        let account = myBank.account.find((acc) => acc.accountNo == ans.num);
        if (!account) {
            console.log(chalk.red.bold("Invalid Account Number !"));
        }
        if (account) {
            let ans = await inquirer.prompt({
                name: "amount",
                type: "number",
                message: "Please Enter Your Amount ! "
            });
            if (ans.amount > account.balance) {
                console.log(chalk.red.bold(`Insufficient Balance ! Please Try Again .`));
            }
            let newBalance = account.balance - ans.amount;
            //transaction method call
            bank.transaction({
                accountNo: account.accountNo,
                balance: newBalance
            });
            console.log(newBalance);
        }
    }
    //Cash Deposit
    if (service.select == "Cash Deposit") {
        let ans = await inquirer.prompt({
            name: "num",
            type: "input",
            message: "Please ! Enter your  Account Number ! ."
        });
        let account = myBank.account.find((acc) => acc.accountNo == ans.num);
        if (!account) {
            console.log(chalk.red.bold("Invalid Account Number !"));
        }
        if (account) {
            let ans = await inquirer.prompt({
                name: "amount",
                type: "number",
                message: "Please Enter Your Amount ! "
            });
            let newBalance = account.balance + ans.amount;
            bank.transaction({
                accountNo: account.accountNo,
                balance: newBalance
            });
            console.log(newBalance);
        }
    }
}
bankService(myBank);
