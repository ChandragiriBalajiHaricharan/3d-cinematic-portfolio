"use client";

import { useEffect } from "react";

export interface CaseStudyData {
  title: string;
  category: string;
  subtitle: string;
  architecture: string;
  codeSnippet: string;
  tests: {
    total: number;
    suites: string[];
    passRate: string;
  };
  metrics: Array<{ label: string; value: string }>;
  overview: string;
}

export const caseStudies: Record<string, CaseStudyData> = {
  "MULTI-AGENT RESEARCH PIPELINE": {
    title: "Multi-Agent Research Pipeline",
    category: "ORCHESTRATION & STATE GRAPHS",
    subtitle: "Autonomous research swarm using LangGraph, Pinecone vector RAG, and multi-model synthesis.",
    overview:
      "A production multi-agent system where a Supervisor Agent decomposes complex research queries into sub-tasks, assigns them to specialized Researcher, Fact-Checker, and Synthesizer agents, and produces citation-backed executive briefs.",
    architecture: `
      [User Query]
           │
           ▼
    ┌──────────────┐
    │  Supervisor  │ ◄────── State Checkpoint (Postgres)
    └──────┬───────┘
           ├────────────────────────┬────────────────────────┐
           ▼                        ▼                        ▼
  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
  │  Source Scraper  │    │  Vector Search   │    │   Fact Checker   │
  │   (Search Web)   │    │    (Pinecone)    │    │ (Cross-Reference)│
  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
           │                        │                        │
           └────────────────────────┴────────────────────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │ Synthesis / Report  │
                         └─────────────────────┘
    `,
    codeSnippet: `from langgraph.graph import StateGraph, END
from pydantic import BaseModel, Field

class ResearchState(BaseModel):
    query: str
    subtasks: list[str] = Field(default_factory=list)
    findings: list[dict] = Field(default_factory=list)
    verified: bool = False
    final_report: str = ""

# Define cyclic multi-agent graph with validation guardrails
workflow = StateGraph(ResearchState)
workflow.add_node("supervisor", supervisor_agent)
workflow.add_node("gather_sources", source_gathering_agent)
workflow.add_node("fact_checker", fact_checking_agent)
workflow.add_node("synthesizer", synthesizer_agent)

workflow.add_edge("supervisor", "gather_sources")
workflow.add_edge("gather_sources", "fact_checker")
workflow.add_conditional_edges(
    "fact_checker",
    lambda state: "synthesizer" if state.verified else "gather_sources"
)
workflow.add_edge("synthesizer", END)
research_graph = workflow.compile()`,
    tests: {
      total: 48,
      suites: ["test_graph_state_transitions.py", "test_cyclic_recovery.py", "test_rag_relevance.py"],
      passRate: "100% (48/48 passed in 1.82s)",
    },
    metrics: [
      { label: "Execution Time", value: "< 4.2s" },
      { label: "Zero Hallucination", value: "99.4%" },
      { label: "Vector Search", value: "Top-K @ 50ms" },
    ],
  },

  "TOOL-CALLING ENGINE (179 TESTS)": {
    title: "Tool-Calling Engine & Runtime",
    category: "ENGINEERING & RESILIENCE",
    subtitle: "High-reliability LLM tool-calling runtime with schema validation, sandboxing, and 179 passing tests.",
    overview:
      "Designed to solve the brittleness of raw LLM function calling in production. Provides automatic Pydantic schema generation, sandbox execution, exponential backoff retries, and comprehensive unit/integration test coverage.",
    architecture: `
    [LLM Tool Request]
           │
           ▼
    ┌──────────────────────────────────┐
    │  Pydantic Schema Validator       │ ──► [Fail: Return Format Error to LLM]
    └──────────────┬───────────────────┘
                   │ Pass
                   ▼
    ┌──────────────────────────────────┐
    │  Safe Execution Sandbox          │
    │  - Timeout Enforcement (5.0s)    │
    │  - Exponential Backoff Retries   │
    └──────────────┬───────────────────┘
                   │
                   ▼
    ┌──────────────────────────────────┐
    │  Structured Output & Telemetry   │
    └──────────────────────────────────┘
    `,
    codeSnippet: `import pytest
from pydantic import BaseModel, ValidationError

class ToolExecutor:
    def __init__(self, max_retries: int = 3, timeout_sec: float = 5.0):
        self.max_retries = max_retries
        self.timeout = timeout_sec

    async def execute(self, tool_name: str, payload: dict):
        tool = registry.get(tool_name)
        validated_args = tool.schema.model_validate(payload)
        return await retry_with_backoff(
            lambda: tool.run(validated_args),
            retries=self.max_retries
        )

# Part of 179 passing automated tests
@pytest.mark.asyncio
async def test_tool_schema_validation_and_retry_resilience():
    executor = ToolExecutor(max_retries=3)
    result = await executor.execute("query_database", {"sql": "SELECT 1"})
    assert result.status == "success"`,
    tests: {
      total: 179,
      suites: ["test_tool_registry.py", "test_schema_enforcement.py", "test_timeout_handling.py", "test_sandbox_isolation.py"],
      passRate: "100% (179/179 passed in 4.12s)",
    },
    metrics: [
      { label: "Passing Tests", value: "179 / 179" },
      { label: "Schema Safety", value: "100% Type-Safe" },
      { label: "Retry Success", value: "98.7%" },
    ],
  },

  "VECTOR MEMORY AGENT": {
    title: "Vector Memory Agent",
    category: "LONG-TERM MEMORY & EMBEDDINGS",
    subtitle: "Conversational intelligence equipped with semantic vector consolidation and cross-session retrieval.",
    overview:
      "A stateful agent memory architecture that automatically stores user preferences, previous decisions, and domain context in vector embeddings, recalling relevant past facts based on semantic similarity.",
    architecture: `
    [User Message] ──► [Embed Query] ──► [Semantic Similarity Search]
                                                   │
                                                   ▼
    [Augmented Prompt] ◄── [Top-K Relevant Memories Consolidated]
           │
           ▼
    [Agent Response] ──► [Background Memory Consolidation / Summarization]
    `,
    codeSnippet: `from chromadb import Client
from langchain_community.embeddings import OpenAIEmbeddings

class MemoryEngine:
    def __init__(self):
        self.client = Client()
        self.collection = self.client.get_or_create_collection("agent_memory")
        self.embedder = OpenAIEmbeddings(model="text-embedding-3-small")

    async def recall(self, query: str, threshold: float = 0.80):
        query_vec = await self.embedder.aembed_query(query)
        results = self.collection.query(query_embeddings=[query_vec], n_results=5)
        return [doc for doc, score in zip(results['documents'][0], results['distances'][0]) if score < threshold]`,
    tests: {
      total: 36,
      suites: ["test_memory_decay.py", "test_semantic_recall.py", "test_duplicate_dedup.py"],
      passRate: "100% (36/36 passed in 1.45s)",
    },
    metrics: [
      { label: "Recall Latency", value: "< 65ms" },
      { label: "Memory Retention", value: "Cross-Session" },
      { label: "Storage Engine", value: "Chroma & Pinecone" },
    ],
  },

  "AUTONOMOUS PR CODE REVIEWER": {
    title: "Autonomous PR Code Reviewer",
    category: "DEV TOOLS & AGENT AUTOMATION",
    subtitle: "Deep AST code review agent embedded directly into GitHub CI/CD pipelines.",
    overview:
      "An automated code review agent that listens to GitHub webhooks, parses AST diffs, checks against security rules and architectural guidelines, and posts inline review comments with suggested code fixes.",
    architecture: `
    [GitHub Pull Request] ──► [Webhook Trigger]
                                    │
                                    ▼
    [AST Diff Parser] ──► [Security & Style Heuristics]
                                    │
                                    ▼
    [LLM Reasoning Engine] ──► [Inline Suggested Fixes & PR Status Check]
    `,
    codeSnippet: `import { Octokit } from "@octokit/rest";

export async function reviewPullRequest(diffText: string, prNumber: number) {
  const analysis = await claude.messages.create({
    model: "claude-3-7-sonnet-20250219",
    messages: [
      { role: "system", content: "You are a senior staff engineer reviewing diffs for security & logic bugs." },
      { role: "user", content: diffText }
    ]
  });

  return postReviewComments(prNumber, analysis.content);
}`,
    tests: {
      total: 42,
      suites: ["test_diff_parsing.ts", "test_webhook_signature.ts", "test_rate_limiter.ts"],
      passRate: "100% (42/42 passed in 2.10s)",
    },
    metrics: [
      { label: "Audit Accuracy", value: "96.2%" },
      { label: "PR Turnaround", value: "< 12s" },
      { label: "False Positive Rate", value: "< 2.5%" },
    ],
  },
};

export default function CaseStudyDrawer({
  projectKey,
  onClose,
}: {
  projectKey: string | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!projectKey) return null;
  const data = caseStudies[projectKey];
  if (!data) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex justify-end bg-black/80 backdrop-blur-md transition-opacity duration-300 pointer-events-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl h-full overflow-y-auto bg-[#0a0d17] border-l border-purple-500/40 p-8 text-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-white font-mono text-sm border border-gray-700 hover:border-purple-400 px-3 py-1.5 rounded-full transition-all cursor-pointer"
        >
          ESC / CLOSE ✕
        </button>

        {/* Category & Title */}
        <p className="font-mono text-xs tracking-widest text-purple-400 mb-2 uppercase">
          {data.category}
        </p>
        <h2 className="text-3xl font-extrabold mb-3 tracking-tight">{data.title}</h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-6">{data.subtitle}</p>

        {/* Metrics Bar */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {data.metrics.map((m) => (
            <div key={m.label} className="p-3 bg-purple-950/20 border border-purple-500/30 rounded-lg text-center">
              <div className="text-xl font-black text-purple-300 font-mono">{m.value}</div>
              <div className="text-xs text-gray-400 font-mono mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <h3 className="text-xs font-mono text-amber-400 tracking-widest uppercase mb-2">
          // SYSTEM OVERVIEW
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-6">{data.overview}</p>

        {/* Architecture */}
        <h3 className="text-xs font-mono text-amber-400 tracking-widest uppercase mb-2">
          // ARCHITECTURE FLOW
        </h3>
        <pre className="p-4 bg-black/70 border border-gray-800 rounded-lg text-xs font-mono text-purple-300 leading-tight mb-6 overflow-x-auto">
          {data.architecture}
        </pre>

        {/* Code Snippet */}
        <h3 className="text-xs font-mono text-amber-400 tracking-widest uppercase mb-2">
          // IMPLEMENTATION CODE
        </h3>
        <pre className="p-4 bg-black/90 border border-purple-500/30 rounded-lg text-xs font-mono text-green-400 leading-relaxed mb-6 overflow-x-auto">
          {data.codeSnippet}
        </pre>

        {/* Test Suite Breakdown */}
        <h3 className="text-xs font-mono text-amber-400 tracking-widest uppercase mb-2">
          // TEST RIGOUR & INTEGRITY
        </h3>
        <div className="p-4 bg-purple-950/20 border border-purple-500/30 rounded-lg mb-8">
          <div className="text-sm font-bold text-green-400 font-mono mb-2">
            ✓ Pass Rate: {data.tests.passRate}
          </div>
          <div className="text-xs text-gray-400 font-mono">
            Key test suites:
            <ul className="list-disc list-inside mt-1 text-gray-300">
              {data.tests.suites.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <a
            href="mailto:contact@balaji.dev"
            className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs tracking-widest uppercase text-center rounded-lg transition-all"
          >
            DISCUSS THIS ARCHITECTURE →
          </a>
        </div>
      </div>
    </div>
  );
}

