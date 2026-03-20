import { NextResponse } from "next/server";
import { parseRepoUrl, fetchRepoMeta, fetchLanguages, fetchOpenIssues, fetchRecentCommits, fetchReadme } from "@/lib/githubClient";
import { claudeAnalyze } from "@/lib/claudeClient";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { repoUrl } = await req.json();
    if (!repoUrl) return NextResponse.json({ error: "repoUrl is required" }, { status: 400 });

    const hash = crypto.createHash("md5").update(repoUrl).digest("hex");
    const scanRef = doc(db, "repo_scans", hash);

    try {
      const cached = await getDoc(scanRef);
      if (cached.exists()) {
        const data = cached.data();
        const ageHours = (Date.now() - (data.createdAt as Timestamp).toMillis()) / 3600000;
        if (ageHours < 24) return NextResponse.json(data.result);
      }
    } catch (e) {
      console.warn("Scan cache read error", e);
    }

    const { owner, repo } = parseRepoUrl(repoUrl);
    if (!owner || !repo) return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });

    const [meta, langs, issues, commits, readme] = await Promise.all([
      fetchRepoMeta(owner, repo),
      fetchLanguages(owner, repo),
      fetchOpenIssues(owner, repo),
      fetchRecentCommits(owner, repo),
      fetchReadme(owner, repo)
    ]);

    const issueList = issues.map((i: any) => `[${i.labels.map((l: any) => l.name).join(",")}] ${i.title}`).join("; ");
    const commitMsgs = commits.map((c: any) => c.commit.message.split("\n")[0]).join("; ");
    const readmeExcerpt = readme.substring(0, 1000);

    const prompt = `You are an expert AI automation consultant analyzing a software project.
Here is the repository data:
- Name: ${meta.full_name}
- Description: ${meta.description}  
- Languages: ${Object.keys(langs).join(", ")}
- Open Issues (${meta.open_issues_count} total): ${issueList}
- Recent commits: ${commitMsgs}
- README summary: ${readmeExcerpt}
- Contributors: 0
- Stars: ${meta.stargazers_count}

Analyze this repository and identify the top 5 automation pain points.
For each pain point, provide:
1. painPoint: one sentence describing the specific problem
2. agentCategory: which type of agent would help (match to one of: code-review, summarization, test-writing, bug-triage, changelog-generation, data-extraction, classification)
3. specificReason: reference specific data from the repo (mention actual issue labels, commit patterns, or file types)
4. estimatedTimeSaved: e.g. '3 hours per week'

Return ONLY a valid JSON array of 5 objects with these exact keys.`;

    const claudeResp = await claudeAnalyze(prompt, `repo-${hash}`);

    let painPoints: any[] = [];
    try {
      const jsonStr = claudeResp.substring(claudeResp.indexOf("["), claudeResp.lastIndexOf("]") + 1);
      painPoints = JSON.parse(jsonStr);
    } catch (e) {
      console.warn("Failed to parse Claude JSON", e);
      return NextResponse.json({ error: "Failed to generate analysis" }, { status: 500 });
    }

    const matchedAgents: any[] = [];
    const agentCols = collection(db, "agents");

    for (const point of painPoints) {
      const q = query(agentCols, where("capabilityTags", "array-contains", point.agentCategory));
      try {
        const snaps = await getDocs(q);
        const agentsForCat = snaps.docs.map(d => ({ id: d.id, ...d.data() }));
        if (agentsForCat.length > 0) {
          matchedAgents.push(agentsForCat[0]); // match at least one
        }
      } catch (e) { /* ignores */ }
    }

    const finalResult = {
      repoMeta: {
        stars: meta.stargazers_count || 0,
        contributors: 0,
        openIssues: meta.open_issues_count || 0,
        primaryLanguage: meta.language
      },
      painPoints,
      matchedAgents
    };

    try {
      await setDoc(scanRef, {
        repoUrl,
        result: finalResult,
        agentMatches: matchedAgents,
        createdAt: Timestamp.now()
      });
    } catch (e) { }

    return NextResponse.json(finalResult);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
