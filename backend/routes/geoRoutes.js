import express from "express";
import axios from "axios";
import { getDistance } from "../utils/distance.js";

const router = express.Router();

// POST /api/check-eligibility
router.post("/check-eligibility", async (req, res) => {
  try {
    const { officePin, candidatePin, maxDistance } = req.body;

    if (!officePin || !candidatePin || !maxDistance) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const apiKey = process.env.OPENCAGE_API_KEY;

    // Get lat/lng + details for both pincodes
    const officeRes = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${officePin}&countrycode=IN&key=${apiKey}`
    );
    const candidateRes = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${candidatePin}&countrycode=IN&key=${apiKey}`
    );

    if (!officeRes.data.results.length || !candidateRes.data.results.length) {
      return res.status(400).json({ error: "Invalid pincode(s)" });
    }

    const officeLoc = officeRes.data.results[0].geometry;
    const candidateLoc = candidateRes.data.results[0].geometry;

    // Extract more detailed candidate area
    const c = candidateRes.data.results[0].components;
    const candidateArea =
      c.suburb ||          // Kandivali, Borivali etc.
      c.neighbourhood ||   // Smaller areas
      c.village ||         
      c.town ||
      c.city_district ||   // fallback before city
      c.city ||
      c.state_district ||
      c.state ||
      "Unknown Area";

    // Calculate distance
    const distance = getDistance(
      officeLoc.lat,
      officeLoc.lng,
      candidateLoc.lat,
      candidateLoc.lng
    );

    const eligible = distance <= maxDistance;

    return res.json({
      eligible,
      distance: distance.toFixed(2),
      candidateArea,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
