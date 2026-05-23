import { NextRequest, NextResponse } from "next/server";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

let todos: Todo[] = [];

export function GET() {
  return NextResponse.json(todos);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { text } = body;

  if (!text || typeof text !== "string" || !text.trim()) {
    return NextResponse.json({ error: "text is required" }, { status: 400 });
  }

  const todo: Todo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
  };

  todos.push(todo);
  return NextResponse.json(todo, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }

  const deleted = todos.splice(index, 1)[0];
  return NextResponse.json(deleted);
}

export function _resetTodos() {
  todos = [];
}

export function _getTodos() {
  return todos;
}
