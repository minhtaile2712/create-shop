require("dotenv").config();
let phoneNumber = process.env.PHONENUMBER;
let password = process.env.PASSWORD;
let baseUrl = process.env.BASEURL;
let msDelay = Number(process.env.MSDELAY);
let shopCount = Number(process.env.SHOPCOUNT);

const { fakerVI: faker } = require("@faker-js/faker");
const axios = require("axios");

async function login(id, pass) {
  let url = `${baseUrl}/authentication/v1/sign-in/password`;
  let identity = { phoneNumber: id, password: pass };
  let accessToken = await axios
    .post(url, identity)
    .then((response) => response.data.accessToken);
  return accessToken;
}

async function createShop(token) {
  let url = `${baseUrl}/authentication/v1/shops`;
  let firstName = faker.person.firstName();
  let lastName = faker.person.lastName();
  let email = faker.internet.email({
    firstName,
    lastName,
    provider: "gmail.com",
  });
  let shopName = `${firstName}'s shop`;
  let shopInfo = {
    name: shopName,
    ownerName: `${lastName} ${firstName}`,
    email: email,
    phone: "",
    categoryIds: [],
    address: {},
  };
  await axios
    .post(url, shopInfo, { headers: { Authorization: `Bearer ${token}` } })
    .then(() => console.log("Created", shopName));
}

function delayMs(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  let accessToken = await login(phoneNumber, password);

  for (let i = 1; i <= shopCount; i++) {
    await createShop(accessToken);
    console.log("Created", i, "shop(s).");
    await delayMs(msDelay);
  }
}

main();
