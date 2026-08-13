const express = require("express");
const router = express.Router();
const prisma = require("../prisma-client");
const logger = require("../logger");

// Save or update a session (conversation + profile + job data)
router.put("/sessions/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const { messages, profile, jobData, completedSections, activeSection } = req.body;

  try {
    const session = await prisma.session.upsert({
      where: { id: sessionId },
      update: {
        messages: messages || [],
        profile: profile || {},
        jobData: jobData || {},
        completedSections: completedSections || [],
        activeSection: activeSection || "personal",
        updatedAt: new Date(),
      },
      create: {
        id: sessionId,
        messages: messages || [],
        profile: profile || {},
        jobData: jobData || {},
        completedSections: completedSections || [],
        activeSection: activeSection || "personal",
      },
    });

    res.json({ ok: true, sessionId: session.id });
  } catch (err) {
    logger.error("Failed to save session", { error: err.message, sessionId });
    res.status(500).json({ error: "Failed to save session" });
  }
});

// Load a session
router.get("/sessions/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
    });

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (err) {
    logger.error("Failed to load session", { error: err.message, sessionId });
    res.status(500).json({ error: "Failed to load session" });
  }
});

// List all sessions
router.get("/sessions", async (req, res) => {
  try {
    const sessions = await prisma.session.findMany({
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        jobData: true,
        updatedAt: true,
        createdAt: true,
      },
    });

    res.json(sessions);
  } catch (err) {
    logger.error("Failed to list sessions", { error: err.message });
    res.status(500).json({ error: "Failed to list sessions" });
  }
});

// Delete a session
router.delete("/sessions/:sessionId", async (req, res) => {
  const { sessionId } = req.params;

  try {
    await prisma.session.delete({ where: { id: sessionId } });
    res.json({ ok: true });
  } catch (err) {
    logger.error("Failed to delete session", { error: err.message, sessionId });
    res.status(500).json({ error: "Failed to delete session" });
  }
});

module.exports = router;
