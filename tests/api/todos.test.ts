import { GET, POST, DELETE, _resetTodos } from "@/app/api/todos/route";
import { NextRequest } from "next/server";

beforeEach(() => {
  _resetTodos();
});

describe("GET /api/todos", () => {
  it("returns empty array initially", async () => {
    const res = await GET();
    const body = await res.json();
    expect(res.status).toBe(200);
    expect(body).toEqual([]);
  });

  it("returns todos after adding", async () => {
    const req = new NextRequest("http://localhost/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: "Test task" }),
    });
    await POST(req);

    const res = await GET();
    const body = await res.json();
    expect(body).toHaveLength(1);
    expect(body[0].text).toBe("Test task");
    expect(body[0].completed).toBe(false);
  });
});

describe("POST /api/todos", () => {
  it("creates a todo and returns 201", async () => {
    const req = new NextRequest("http://localhost/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: "New task" }),
    });
    const res = await POST(req);
    const body = await res.json();

    expect(res.status).toBe(201);
    expect(body.text).toBe("New task");
    expect(body.completed).toBe(false);
    expect(body.id).toBeDefined();
  });

  it("returns 400 if text is missing", async () => {
    const req = new NextRequest("http://localhost/api/todos", {
      method: "POST",
      body: JSON.stringify({}),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it("returns 400 if text is empty string", async () => {
    const req = new NextRequest("http://localhost/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: "   " }),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("DELETE /api/todos", () => {
  it("deletes a todo by id", async () => {
    const createReq = new NextRequest("http://localhost/api/todos", {
      method: "POST",
      body: JSON.stringify({ text: "Delete me" }),
    });
    const createRes = await POST(createReq);
    const created = await createRes.json();

    const deleteReq = new NextRequest(
      `http://localhost/api/todos?id=${created.id}`,
      { method: "DELETE" }
    );
    const deleteRes = await DELETE(deleteReq);
    expect(deleteRes.status).toBe(200);

    const listRes = await GET();
    const list = await listRes.json();
    expect(list).toHaveLength(0);
  });

  it("returns 400 if id is missing", async () => {
    const req = new NextRequest("http://localhost/api/todos", {
      method: "DELETE",
    });
    const res = await DELETE(req);
    expect(res.status).toBe(400);
  });

  it("returns 404 if id is not found", async () => {
    const req = new NextRequest(
      "http://localhost/api/todos?id=nonexistent",
      { method: "DELETE" }
    );
    const res = await DELETE(req);
    expect(res.status).toBe(404);
  });
});
