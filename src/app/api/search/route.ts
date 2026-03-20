import { NextResponse } from "next/server";
import { queryNearestAgents } from "@/lib/vectorSearch";
import { claudeAnalyze } from "@/lib/claudeClient";
import crypto from "crypto";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAgentById } from "@/lib/firestore";

export async function POST(req: Request) {
  try {
    const { query } = await req.json();
    if (!query) return NextResponse.json({ error: "Query is required" }, { status: 400 });

    const hash = crypto.createHash("md5").update(query).digest("hex");
    const cacheRef = doc(db, "search_cache", hash);

    try {
      const cached = await getDoc(cacheRef);
      if (cached.exists()) {
        const data = cached.data();
        const ageHours = (Date.now() - (data.createdAt as Timestamp).toMillis()) / 3600000;
        if (ageHours < 1) return NextResponse.json(data.results);
      }
    } catch (e) {
      console.warn("Search cache read error", e);
    }

    const nearest = await queryNearestAgents(query, 10);
    const candidateIds = nearest.map((n: any) => n.id);
    const candidateDocs = await Promise.all(candidateIds.map((id: string) => getAgentById(id)));
    const validCandidates = candidateDocs.filter(Boolean);

    const agentListText = validCandidates.map((a: any) =>
      `ID: ${a.id}\nName: ${a.name}\nDesc: ${a.description}\nTags: ${a.capabilityTags?.join(",")}`
    ).join("\n\n");

    const prompt = `You are a helpful AI agent recommender. A user is looking for: '${query}'. Here are 10 candidate agents:\n\n${agentListText}\n\nReturn a JSON array of the top 5 agents ranked by relevance, with a one-sentence 'matchReason' for each explaining why it fits. Format: [{"id": "...", "matchReason": "..."}]`;

    const claudeResp = await claudeAnalyze(prompt, `search-${hash}`, 24);

    // Parse JSON safely
    let aiRanking: { id: string, matchReason: string }[] = [];
    try {
      const jsonStr = claudeResp.substring(claudeResp.indexOf("["), claudeResp.lastIndexOf("]") + 1);
      if (jsonStr) aiRanking = JSON.parse(jsonStr);
    } catch (e) {
      console.warn("Claude JSON parse error", e);
    }

    const finalResults = aiRanking.map(rank => {
      const agent = validCandidates.find((a: any) => a.id === rank.id);
      return { agent, matchReason: rank.matchReason };
    }).filter(r => r.agent);

    try {
      await setDoc(cacheRef, { results: finalResults, queryHash: hash, createdAt: Timestamp.now() });
    } catch (e) {
      console.warn("Search cache write error", e);
    }

    return NextResponse.json(finalResults);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
