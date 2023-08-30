const { Router } = require("express");
const router = Router();
const { login, logout, getNewAccessToken } = require("./controllers");

router.route("/").get(async (req, res) => {
    res.json({ message: "lopez" });
});

router.route("/auth/login").post(login); 

router.route("/auth/logout").post(logout); 

router.route("/auth/refresh").get(getNewAccessToken);


module.exports = router;
