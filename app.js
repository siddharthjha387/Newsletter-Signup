const express = require('express');
const request = require('request');//npm install request
const bodyparser = require('body-parser');
const https = require('https');
const app = express();

app.use(express.static("public"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var firstName = req.body.fname;
  var lastName = req.body.lname;
  var email = req.body.email;
  console.log(firstName, lastName, email);

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us5.api.mailchimp.com/3.0/lists/apikey"
  const options = {
    method: "POST",
    auth: "confidential"
  }
  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      // console.log("success");
      res.sendFile(__dirname + "/success.html");
    }
    else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function (data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
})


app.post("/failure.html", function (req, res) {
  res.redirect("/");
})


app.listen(process.env.PORT || 3000, function (req, res) {
  console.log("Server is running on Port 3000");
});

