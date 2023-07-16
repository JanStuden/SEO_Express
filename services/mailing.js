import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'Cohnen.Max@googlemail.com',
        pass: 'gmpqtcwzinaarojz',
    },
});

export const sendRecoveryMail = async (recipient, username, password) => {
    transporter.sendMail({
        from: '"Team @LMUxMM SEO Dashboard" <Cohnen.Max@googlemail.com>',
        to: recipient,
        subject: "Your New Password",
        html: `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
        <title>New Password</title>
    <style>
        /* Inline CSS styles */
        body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
    }

        .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

        h1 {
        color: #333333;
    }

        p {
        margin-bottom: 20px;
    }

        .password {
        font-weight: bold;
        font-size: 18px;
        background-color: #f9f9f9;
        border: 1px solid #cccccc;
        border-radius: 4px;
        padding: 10px;
    }

        .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
    }
    </style>
</head>
    <body>
    <div class="container">
        <h1>Password Reset</h1>
        <p>Dear ` + username + `, you requested a password reset. Attached you can find a temporary password. Please choose a new password as soon as possible.</p>
        <p>Temporary Password: <span class="password">` + password +`</span></p>
        <p>
            <a class="button" href="http://localhost:3000/login">SEO Dashboard</a>
        </p>
    </div>
    </body>
</html>`, // html body
    }).then(info => {
        console.log({info});
    }).catch(console.error);
}

export const sendSignUpMail = async (recipient, username, password) => {
    transporter.sendMail({
        from: '"Team @LMUxMM SEO Dashboard" <Cohnen.Max@googlemail.com>',
        to: recipient,
        subject: "Welcome @LMUxMM SEO Dashboard",
        html: `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
        <title>Welcome!</title>
    <style>
        /* Inline CSS styles */
        body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
    }

        .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

        h1 {
        color: #333333;
    }

        p {
        margin-bottom: 20px;
    }

        .password {
        font-weight: bold;
        font-size: 18px;
        background-color: #f9f9f9;
        border: 1px solid #cccccc;
        border-radius: 4px;
        padding: 10px;
    }

        .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
    }
    </style>
</head>
    <body>
    <div class="container">
        <h1>Welcome!</h1>
        <p>Dear ` + username + `, welcome to the LMUxMM SEO Dashboard! This is a confirmation for the creation of your account. Attached you can find a temporary password. Please choose a new password as soon as possible.</p></p>
        <p>Temporary Password: <span class="password">` + password + `</span></p>
        <p>
            <a class="button" href="http://localhost:3000/login">SEO Dashboard</a>
        </p>
    </div>
    </body>
</html>`, // html body
    }).then(info => {
        console.log({info});
    }).catch(console.error);
}

export const sendDeletionConfirmation = async (recipient, username) => {
    transporter.sendMail({
        from: '"Team @LMUxMM SEO Dashboard" <Cohnen.Max@googlemail.com>',
        to: recipient,
        subject: "Goodbye From LMUxMM SEO Dashboard",
        html: `<!DOCTYPE html>
    <html>
    <head>
    <meta charset="UTF-8">
        <title>Goodbye!</title>
    <style>
        /* Inline CSS styles */
        body {
        font-family: Arial, sans-serif;
        background-color: #f5f5f5;
    }

        .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

        h1 {
        color: #333333;
    }

        p {
        margin-bottom: 20px;
    }

        .password {
        font-weight: bold;
        font-size: 18px;
        background-color: #f9f9f9;
        border: 1px solid #cccccc;
        border-radius: 4px;
        padding: 10px;
    }

        .button {
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 4px;
    }
    </style>
</head>
    <body>
    <div class="container">
        <h1>Goodbye!</h1>
        <p>Dear ` + username + `, we hereby confirm the deletion of your account. We are sad to lose you as a user.</p>
    </div>
    </body>
</html>`, // html body
    }).then(info => {
        console.log({info});
    }).catch(console.error);
}