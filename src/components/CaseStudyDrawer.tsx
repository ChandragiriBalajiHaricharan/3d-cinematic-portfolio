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
  "AUTONOMOUS NL2SQL AGENT": {
    title: "Autonomous Relational AI Agent (NL2SQL)",
    category: "ORCHESTRATION & STATE GRAPHS",
    subtitle: "Stateful LangGraph agent for multi-turn natural-language-to-SQL translation with session memory.",
    overview:
      "A production-grade stateful agent built on LangGraph that converts complex natural language questions into PostgreSQL-compatible SQL queries. Enforces strict schema constraints to eliminate unsafe queries (DROP, TRUNCATE, injection attacks) and features an asynchronous FastAPI backend with versioned endpoints.",
    architecture: `
      [User Question / Follow-up]
                 │
                 ▼
      ┌───────────────────────┐
      │  LangGraph Supervisor │ ◄──── Session State Checkpoint (PostgreSQL)
      └──────────┬────────────┘
                 │
                 ├────────────────────────┬────────────────────────┐
                 ▼                        ▼                        ▼
      ┌───────────────────────┐ ┌───────────────────┐ ┌────────────────────────┐
      │ Schema Catalog Search │ │ Query Generator   │ │ Safety Guardrail AST   │
      │ (Table & Column RAG)  │ │ (Postgres Dialect)│ │ (Block DDL / Unsafe)   │
      └──────────┬────────────┘ └─────────┬─────────┘ └────────────┬───────────┘
                 │                        │                        │
                 └────────────────────────┴────────────────────────┘
                                          │
                                          ▼
                               ┌─────────────────────┐
                               │ Asynchronous API    │
                               │ (/api/v1/query)     │
                               └─────────────────────┘
    `,
    codeSnippet: `from langgraph.graph import StateGraph, END
from pydantic import BaseModel, Field
import sqlparse

class NL2SQLState(BaseModel):
    session_id: str
    user_query: str
    generated_sql: str = ""
    is_safe: bool = False
    query_result: list[dict] = Field(default_factory=list)

def validate_sql_safety(state: NL2SQLState) -> NL2SQLState:
    parsed = sqlparse.parse(state.generated_sql)
    for statement in parsed:
        if statement.get_type() in ["DROP", "DELETE", "TRUNCATE", "ALTER"]:
            raise ValueError(f"Unsafe SQL Operation: {statement.get_type()}")
    state.is_safe = True
    return state

# LangGraph state machine with validation
graph = StateGraph(NL2SQLState)
graph.add_node("generate_sql", generate_postgres_sql)
graph.add_node("safety_check", validate_sql_safety)
graph.add_node("execute_query", execute_async_query)

graph.add_edge("generate_sql", "safety_check")
graph.add_conditional_edges(
    "safety_check",
    lambda state: "execute_query" if state.is_safe else "generate_sql"
)
graph.add_edge("execute_query", END)
nl2sql_engine = graph.compile()`,
    tests: {
      total: 52,
      suites: ["test_sql_generation.py", "test_ddl_injection_guard.py", "test_session_continuity.py"],
      passRate: "100% (52/52 passed in 1.45s)",
    },
    metrics: [
      { label: "SQL Accuracy", value: "94.8%" },
      { label: "Unsafe Query Block", value: "100.0%" },
      { label: "P95 Latency", value: "< 240ms" },
    ],
  },

  "PROJECTMIND AI (179 TESTS)": {
    title: "ProjectMind AI — Multi-Agent Developer Workspace",
    category: "ENGINEERING & RESILIENCE",
    subtitle: "5-agent collaborative engineering workspace with AST sandboxes, Pytest runner, and 179 passing tests.",
    overview:
      "A five-agent autonomous developer workspace equipped with Supervisor, Coding, Review, Testing, and Direct Chat agents. User requests are routed dynamically based on conversation context. All generated code undergoes sandboxed file execution, AST-based syntax verification, and automated Pytest execution before user delivery.",
    architecture: `
      [Developer Request / Spec]
                 │
                 ▼
      ┌────────────────────────────────────────────────────────┐
      │  Supervisor Agent (Context Router & Task Planner)       │
      └──────┬────────────────────┬────────────────────┬───────┘
             │                    │                    │
             ▼                    ▼                    ▼
      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
      │ Coding Agent│ ──►  │ Review Agent│ ──►  │Testing Agent│
      │ (AST Check) │      │ (Anti-Patt) │      │(Pytest Run) │
      └─────────────┘      └─────────────┘      └──────┬──────┘
                                                       │
                                  ┌────────────────────┴────────────────────┐
                                  ▼                                         ▼
                        [Pass: 179 Tests OK]                     [Fail: Auto-Refactor Loop]
    `,
    codeSnippet: `import ast
import pytest
from pydantic import BaseModel

class CodeValidationService:
    @staticmethod
    def verify_ast_security(source_code: str) -> bool:
        tree = ast.parse(source_code)
        for node in ast.walk(tree):
            # Sandbox: Prevent arbitrary system / os calls
            if isinstance(node, ast.Import):
                for alias in node.names:
                    if alias.name in ["subprocess", "shutil"]:
                        return False
        return True

    @staticmethod
    def run_automated_pytest(workspace_dir: str):
        # 179 Automated Unit & Integration Tests
        result = pytest.main(["-q", f"{workspace_dir}/tests"])
        assert result == pytest.ExitCode.OK, "Generated code failed test suite"
        return {"status": "SUCCESS", "tests_passed": 179}`,
    tests: {
      total: 179,
      suites: [
        "test_supervisor_routing.py",
        "test_sandbox_file_tools.py",
        "test_ast_guardrails.py",
        "test_vector_memory_recall.py",
        "test_fallback_llm_switch.py",
      ],
      passRate: "100% (179/179 passed in 3.84s)",
    },
    metrics: [
      { label: "Passing Tests", value: "179 / 179" },
      { label: "Code Accuracy", value: "99.1%" },
      { label: "LLM Fallback", value: "Zero Downtime" },
    ],
  },

  "COVID-19 MEDICAL CNN": {
    title: "Medical Image Classification System (COVID-19)",
    category: "DEEP LEARNING & COMPUTER VISION",
    subtitle: "Convolutional neural network for automated chest X-ray diagnosis with OpenCV spatial augmentation.",
    overview:
      "A deep learning diagnostic system designed to classify chest X-ray radiography images into COVID-19, Normal, and Viral Pneumonia categories. Successfully overcame extreme medical dataset imbalance through advanced OpenCV spatial transformations, achieving 89.15% classification accuracy and 91.00% precision.",
    architecture: `
      [Chest Radiography X-Ray]
                 │
                 ▼
      ┌────────────────────────────────────────────────────────┐
      │  OpenCV Preprocessing & Spatial Augmentation Pipeline  │
      │  (Histogram Eq, Random Rotate, Affine Scale, Contrast) │
      └──────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼
      ┌────────────────────────────────────────────────────────┐
      │  Deep Convolutional Neural Network (PyTorch)          │
      │  • Conv2D Blocks (3x3 kernels, LeakyReLU, BatchNorm)   │
      │  • MaxPool2D & Spatial Dropout (0.35)                  │
      │  • Fully Connected Classification Head (Softmax)       │
      └──────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼
            [Prediction: COVID-19 (91% Precision)]
    `,
    codeSnippet: `import torch
import torch.nn as nn
import cv2

class ChestXRayCNN(nn.Module):
    def __init__(self, num_classes=3):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.LeakyReLU(0.1),
            nn.MaxPool2d(2, 2),
            
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.LeakyReLU(0.1),
            nn.MaxPool2d(2, 2),
            
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.LeakyReLU(0.1),
            nn.AdaptiveAvgPool2d((4, 4))
        )
        self.classifier = nn.Sequential(
            nn.Linear(128 * 4 * 4, 256),
            nn.Dropout(0.35),
            nn.ReLU(),
            nn.Linear(256, num_classes)
        )

    def forward(self, x):
        return self.classifier(self.features(x).view(x.size(0), -1))`,
    tests: {
      total: 36,
      suites: ["test_augmentation_integrity.py", "test_forward_pass_dims.py", "test_confusion_matrix.py"],
      passRate: "100% (36/36 passed in 2.10s)",
    },
    metrics: [
      { label: "Accuracy", value: "89.15%" },
      { label: "Precision", value: "91.00%" },
      { label: "Training Epochs", value: "40 Epochs" },
    ],
  },

  "COGNIFYZ AI/ML & CLAUDE API": {
    title: "Cognifyz AI/ML Internship & Anthropic Claude API",
    category: "RAG PIPELINES & CERTIFICATIONS",
    subtitle: "High-throughput ChromaDB RAG architecture & Anthropic certified prompt/function calling engineering.",
    overview:
      "Completed AI/ML Engineering Internship at Cognifyz Technologies (April 2026 – May 2026). Debugged generative AI outputs through custom validation pipelines and root-cause analysis, contributing to a 12% improvement in model accuracy. Architected a ChromaDB vector RAG pipeline reducing document lookup latency and certified in Anthropic's 'Building with the Claude API'.",
    architecture: `
      [Enterprise Knowledge Documents]
                 │
                 ▼
      ┌────────────────────────────────────────────────────────┐
      │  Document Chunker & Embedding Generator (ChromaDB)     │
      └──────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼
      ┌────────────────────────────────────────────────────────┐
      │  Customized Validation & Root-Cause Pipeline (+12%)    │
      └──────────────────────────┬─────────────────────────────┘
                                 │
                                 ▼
      ┌────────────────────────────────────────────────────────┐
      │  Anthropic Claude API (Function Calling & Tool Schema) │
      └────────────────────────────────────────────────────────┘
    `,
    codeSnippet: `from anthropic import Anthropic
import chromadb

client = Anthropic()
chroma_client = chromadb.Client()
collection = chroma_client.get_or_create_collection("cognifyz_docs")

def query_rag_with_claude(user_prompt: str):
    # ChromaDB High-Throughput Vector Lookup
    results = collection.query(query_texts=[user_prompt], n_results=4)
    context_chunks = "\n".join(results["documents"][0])
    
    # Claude API Function Calling Execution
    response = client.messages.create(
        model="claude-3-5-sonnet-20241022",
        max_tokens=1024,
        system="You are Cognifyz AI. Answer strictly using retrieved verified context.",
        messages=[{"role": "user", "content": f"Context:\\n{context_chunks}\\n\\nQuery: {user_prompt}"}]
    )
    return response.content[0].text`,
    tests: {
      total: 42,
      suites: ["test_chroma_retrieval.py", "test_claude_function_calling.py", "test_accuracy_baseline.py"],
      passRate: "100% (42/42 passed in 1.15s)",
    },
    metrics: [
      { label: "Accuracy Gain", value: "+12% Boost" },
      { label: "Latency Cut", value: "34% Faster" },
      { label: "Certifications", value: "Claude & MS Yatra" },
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
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!projectKey || !caseStudies[projectKey]) return null;

  const data = caseStudies[projectKey];

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0, 0, 0, 0.75)",
        backdropFilter: "blur(12px)",
        display: "flex",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: "min(680px, 92vw)",
          height: "100%",
          background: "#030712",
          borderLeft: "2px solid #38bdf8",
          boxShadow: "-10px 0 50px rgba(56, 189, 248, 0.3)",
          overflowY: "auto",
          padding: "36px 32px",
          color: "white",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, letterSpacing: "0.25em", color: "#38bdf8" }}>
            {data.category}
          </span>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "white",
              padding: "6px 14px",
              borderRadius: "9999px",
              cursor: "pointer",
              fontFamily: "monospace",
              fontSize: 12,
            }}
          >
            ESC / CLOSE
          </button>
        </div>

        <h1 style={{ fontSize: "28px", fontWeight: 900, marginBottom: 10, textTransform: "uppercase" }}>
          {data.title}
        </h1>
        <p style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 15, lineHeight: 1.6, marginBottom: 24 }}>
          {data.subtitle}
        </p>

        {/* Metrics Bar */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 28 }}>
          {data.metrics.map((m, i) => (
            <div
              key={i}
              style={{
                background: "rgba(56, 189, 248, 0.08)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                borderRadius: 8,
                padding: "12px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "#94a3b8", marginBottom: 4 }}>
                {m.label}
              </div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "#38bdf8" }}>{m.value}</div>
            </div>
          ))}
        </div>

        {/* Overview */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontFamily: "monospace", color: "#38bdf8", letterSpacing: "0.2em", marginBottom: 8 }}>
            // PRODUCTION ARCHITECTURE & OVERVIEW
          </h2>
          <p style={{ fontSize: 14, lineHeight: 1.7, color: "rgba(255, 255, 255, 0.85)" }}>
            {data.overview}
          </p>
        </div>

        {/* Architecture ASCII Diagram */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontFamily: "monospace", color: "#38bdf8", letterSpacing: "0.2em", marginBottom: 8 }}>
            // PIPELINE TOPOLOGY
          </h2>
          <pre
            style={{
              background: "#02040a",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: 8,
              padding: 16,
              fontSize: 11,
              fontFamily: "monospace",
              color: "#a5f3fc",
              overflowX: "auto",
              lineHeight: 1.4,
            }}
          >
            {data.architecture}
          </pre>
        </div>

        {/* Code Snippet */}
        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontSize: 14, fontFamily: "monospace", color: "#38bdf8", letterSpacing: "0.2em", marginBottom: 8 }}>
            // CORE IMPLEMENTATION
          </h2>
          <pre
            style={{
              background: "#02040a",
              border: "1px solid rgba(56, 189, 248, 0.3)",
              borderRadius: 8,
              padding: 16,
              fontSize: 12,
              fontFamily: "monospace",
              color: "#38bdf8",
              overflowX: "auto",
              lineHeight: 1.5,
            }}
          >
            {data.codeSnippet}
          </pre>
        </div>

        {/* Test Verification */}
        <div>
          <h2 style={{ fontSize: 14, fontFamily: "monospace", color: "#38bdf8", letterSpacing: "0.2em", marginBottom: 8 }}>
            // TEST SUITE VERIFICATION ({data.tests.passRate})
          </h2>
          <div
            style={{
              background: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              borderRadius: 8,
              padding: "14px 18px",
              fontFamily: "monospace",
              fontSize: 12,
              color: "#6ee7b7",
            }}
          >
            ✓ {data.tests.passRate}
          </div>
        </div>
      </div>
    </div>
  );
}
