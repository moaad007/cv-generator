const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "logs");
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const LOG_FILE = path.join(LOG_DIR, "app.log");
const ERROR_FILE = path.join(LOG_DIR, "error.log");

function timestamp() {
  return new Date().toISOString();
}

function formatMsg(level, msg, meta) {
  const base = `[${timestamp()}] [${level}] ${msg}`;
  return meta ? `${base} ${JSON.stringify(meta)}` : base;
}

const logger = {
  info(msg, meta) {
    const line = formatMsg("INFO", msg, meta);
    console.log(line);
    fs.appendFileSync(LOG_FILE, line + "\n");
  },
  warn(msg, meta) {
    const line = formatMsg("WARN", msg, meta);
    console.warn(line);
    fs.appendFileSync(LOG_FILE, line + "\n");
    fs.appendFileSync(ERROR_FILE, line + "\n");
  },
  error(msg, meta) {
    const line = formatMsg("ERROR", msg, meta);
    console.error(line);
    fs.appendFileSync(LOG_FILE, line + "\n");
    fs.appendFileSync(ERROR_FILE, line + "\n");
  },
  request(req, res, duration) {
    const meta = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    };
    if (res.statusCode >= 400) {
      logger.warn(`${req.method} ${req.originalUrl} ${res.statusCode}`, meta);
    } else {
      logger.info(`${req.method} ${req.originalUrl} ${res.statusCode}`, meta);
    }
  },
};

module.exports = logger;
