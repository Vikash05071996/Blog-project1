const express = require('express');
const router = express.Router();
const user = require('./vikk.js');
//const app = express();
router.use(express.json());

router.post("/create", async(req, res) => {
    const data = req.body;
    await user.add(data)
    res.send({ msg: "user added" })
});
router.listen(4000, () => console.log("up and running 4000"))
module.exports = router;