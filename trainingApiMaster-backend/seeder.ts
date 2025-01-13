import fs from "fs";
import mongoose from "mongoose";
import Project from "./src/models/projects";
import User from "./src/models/users";

import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });

mongoose.connect(process.env.MONGO_URI as string, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

/**
 * Read JSON File
 */
const projects = JSON.parse(fs.readFileSync(`${__dirname}/_data/projects.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, "utf-8"));

/**
 * Import into DB
 */
const importData = async () => {
  try {
    await Project.create(projects);
    await User.create(users);
    console.log("<)))><...Data imported...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

/**
 * Delete Data
 */
const deleteData = async () => {
  try {
    await Project.deleteMany();
    await User.deleteMany();
    console.log("<)))><...Data Deleted...");
    process.exit();
  } catch (err) {
    console.error(err);
  }
};

/**
 * コマンド引数で処理を指定する
 * seeder.js -i -> importData
 * seeder.js -d -> deleteData
 */
if (process.argv[2] === "-i") {
  importData();
} else if (process.argv[2] === "-d") {
  deleteData();
}
