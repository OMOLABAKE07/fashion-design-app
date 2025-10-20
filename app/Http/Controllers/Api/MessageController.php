<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Message;
use Illuminate\Http\Request;

class MessageController extends Controller
{
    public function index()
    {
        return response()->json(Message::with('customer')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_id' => 'nullable|exists:customers,id',
            'subject' => 'required|string|max:255',
            'content' => 'required|string',
            'status' => 'nullable|string',
        ]);

        $message = Message::create($validated);
        return response()->json($message, 201);
    }

    public function show($id)
    {
        return response()->json(Message::with('customer')->findOrFail($id), 200);
    }

    public function update(Request $request, $id)
    {
        $message = Message::findOrFail($id);
        $message->update($request->all());
        return response()->json($message, 200);
    }

    public function destroy($id)
    {
        Message::destroy($id);
        return response()->json(['message' => 'Message deleted'], 204);
    }
}
