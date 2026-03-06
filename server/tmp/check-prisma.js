const prisma = require("../src/config/prisma");

async function check() {
  try {
    const model = prisma._runtimeDataModel.models.JobApplication;
    console.log("JobApplication Model Fields at Runtime:");
    console.log(model.fields.map((f) => f.name));
    process.exit(0);
  } catch (err) {
    console.error("Error accessing model metadata:", err);
    process.exit(1);
  }
}

check();
