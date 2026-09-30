import sys
import os

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi.testclient import TestClient
from main import app, generate_aura_response

client = TestClient(app)

def test_all():
    # 1. Health
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["agent"] == "AURA"
    print("[PASS] /api/health passed")

    # 2. System Info
    res = client.get("/api/system/info")
    assert res.status_code == 200
    data = res.json()
    assert "cpuPercent" in data
    assert "memory" in data
    print("[PASS] /api/system/info passed:", data["os"], data["architecture"])

    # 3. Chat with Dance Detection
    res = client.post("/api/chat", json={
        "messages": [{"role": "user", "content": "Dance to hip hop for me"}]
    })
    assert res.status_code == 200
    data = res.json()
    assert data["avatarState"] == "dancing"
    assert data["danceStyle"] == "hip_hop"
    print("[PASS] /api/chat (dance detection) passed")

    # 4. Agent Plan
    res = client.post("/api/agent/plan", json={"task": "Run system diagnostics"})
    assert res.status_code == 200
    plan = res.json()
    assert len(plan["steps"]) >= 2
    print("[PASS] /api/agent/plan passed with", len(plan["steps"]), "stages")

    # 5. Execute Step (safe tool)
    step = plan["steps"][0]
    res = client.post("/api/agent/execute-step", json={"step": step, "confirmed": True})
    print("execute-step response:", res.status_code, res.json())
    assert res.status_code == 200
    assert res.json()["status"] == "completed"
    print("[PASS] /api/agent/execute-step passed")

    # 6. Safety Guardrail on unconfirmed destructive action
    destructive_step = {
        "id": "danger_1",
        "tool": "create_file",
        "description": "Delete production tables",
        "requiresConfirmation": True
    }
    res = client.post("/api/agent/execute-step", json={"step": destructive_step, "confirmed": False})
    assert res.status_code == 403
    print("[PASS] Security guardrail confirmation test passed (HTTP 403 on unconfirmed action)")

    # 7. Code Generation Tool
    code_step = {
        "id": "code_1",
        "tool": "code_generator",
        "description": "Generate Python script",
        "params": {"task": "write script"},
        "requiresConfirmation": False
    }
    res = client.post("/api/agent/execute-step", json={"step": code_step, "confirmed": True})
    assert res.status_code == 200
    assert res.json()["result"]["language"] == "python"
    print("[PASS] /api/agent/execute-step (code_generator) passed")

    # 8. Document Summary Tool
    summary_step = {
        "id": "sum_1",
        "tool": "document_summary",
        "description": "Summarize system logs",
        "params": {"task": "summarize logs"},
        "requiresConfirmation": False
    }
    res = client.post("/api/agent/execute-step", json={"step": summary_step, "confirmed": True})
    assert res.status_code == 200
    assert "summary" in res.json()["result"]
    print("[PASS] /api/agent/execute-step (document_summary) passed")

    print("\nALL 8 AURA BACKEND TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_all()
