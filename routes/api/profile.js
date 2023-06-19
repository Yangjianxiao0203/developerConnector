const express = require("express");
const request = require("request");
const axios = require("axios");

const config = require("config");
const auth = require("../../middleware/auth");
const router = express.Router();
const { check, validationResult } = require("express-validator");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profiles
// @desc    get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.status(200).json(profiles);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profiles/me
// @desc    get my profile, auth to decode the encryted id
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    ); // populate 关联： 将查询到的Profile 与其关联的user表的name和avatar合并
    if (!profile) {
      return res.status(400).json({ msg: "you don't have any profile" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   POST api/profiles
// @desc    create or update a profile
// @Params: a json file in header
// @access  Private : need token in header, the id in user collections
router.post(
  "/",
  [
    auth,
    check("status", "Status is required").not().isEmpty(),
    check("skills", "Skills is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) {
      profileFields.company = company;
    }
    if (website) {
      profileFields.website = website;
    }
    if (location) {
      profileFields.location = location;
    }
    if (bio) {
      profileFields.bio = bio;
    }
    if (status) {
      profileFields.status = status;
    }
    if (githubusername) {
      profileFields.githubusername = githubusername;
    }
    profileFields.date = Date.now();
    if (skills) {
      //split the string into array, and trim the space
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (youtube) {
      profileFields.social.youtube = youtube;
    }
    if (twitter) {
      profileFields.social.twitter = twitter;
    }
    if (facebook) {
      profileFields.social.facebook = facebook;
    }
    if (linkedin) {
      profileFields.social.linkedin = linkedin;
    }
    if (instagram) {
      profileFields.social.instagram = instagram;
    }

    // see if the profile already exist
    try {
      let profile = await Profile.findOne({ user: req.user.id });
      if (!profile) {
        // not exist
        profile = new Profile(profileFields);
        await profile.save();
      } else {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields }, //将 profileFields 对象中的字段值更新到匹配的文档中
          { new: true } //返回更新后的文档
        );
      }
      return res.status(200).json(profile);
    } catch (err) {
      res.status(500).send("Server Error" + err.message);
    }
  }
);

// @route   GET api/profiles/user/:user_id
// @desc    get profile by user id
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profile) {
      return res.status(400).json({ msg: "Profile not found" });
    }
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

// @route   DELETE api/profiles/
// @desc    delete profile, user and posts
// @access  Private: by token
router.delete("/", auth, async (req, res) => {
  try {
    //Profile 中有user属性，User中有_id属性
    await Profile.findOneAndDelete({ user: req.user.id });
    await User.findOneAndDelete({ _id: req.user.id });
    return res.status(200).json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

// @route   PUT api/profiles/experience
// @desc    add profile experience
// @access  Private: by token
router.put(
  "/experience",
  [
    auth,
    check("title", "Title is required").not().isEmpty(),
    check("company", "Company is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    //destructure the request
    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title: title,
      company: company,
      location: location,
      from: from,
      to: to,
      current: current,
      description: description,
    };

    // update the experience in mangoDB
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // 在数组最前头加一个对象，arrayObject.unshift(object)
      profile.experience.unshift(newExp);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send("Server Error: " + err.message);
    }
  }
);

// @route   DELETE api/profiles/experience/:exp_id
// @desc    delete one of profile experience
// @access  Private: by token
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.experience.findIndex((elem) => {
      return elem._id.toString() == req.params.exp_id;
    });
    if (removeIndex == -1) {
      return res.status(400).send("experience not existed");
    } else {
      profile.experience.splice(removeIndex, 1);
    }
    await profile.save();
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

// @route   PUT api/profiles/education
// @desc    add profile experience
// @access  Private: by token
router.put(
  "/education",
  [
    auth,
    check("school", "School is required").not().isEmpty(),
    check("degree", "Degree is required").not().isEmpty(),
    check("from", "From date is required").not().isEmpty(),
    check("fieldofstudy", "Field of study is required ").not().isEmpty(),
  ],
  async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ errors: error.array() });
    }

    //destructure the request
    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school: school,
      degree: degree,
      fieldofstudy: fieldofstudy,
      from: from,
      to: to,
      current: current,
      description: description,
    };

    // update the education in mangoDB
    try {
      const profile = await Profile.findOne({ user: req.user.id });
      // 在数组最前头加一个对象，arrayObject.unshift(object)
      profile.education.unshift(newEdu);
      await profile.save();
      res.json(profile);
    } catch (err) {
      res.status(500).send("Server Error: " + err.message);
    }
  }
);

// @route   DELETE api/profiles/education/:edu_id
// @desc    delete one of profile education
// @access  Private: by token
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });
    const removeIndex = profile.education.findIndex((elem) => {
      return elem._id.toString() == req.params.edu_id;
    });
    if (removeIndex == -1) {
      return res.status(400).send("education not existed");
    } else {
      profile.education.splice(removeIndex, 1);
    }
    await profile.save();
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).send("Server Error: " + err.message);
  }
});

// @route   GET api/profiles/github/:username
// @desc    get user repos from github
// @access  public
router.get("/github/:username", async (req, res) => {
  try {
    const options = {
      url: `http://api.github.com/users/${req.params.username}/repos`,
      method: "GET",
      headers: { "user-agent": "node.js" },
      params: {
        per_page: 5,
        sort: "created:asc",
        client_id: config.get("githubClientId"),
        client_secret: config.get("githubSecret"),
      },
    };

    const response = await axios(options);
    res.json(response.data);
  } catch (err) {
    if (err.response && err.response.status === 404) {
      res.status(404).json({ msg: "GitHub not found" });
    } else {
      res.status(500).send("Server Error: " + err.message);
    }
  }
});

module.exports = router;
