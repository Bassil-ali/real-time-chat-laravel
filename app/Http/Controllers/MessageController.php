<?php

namespace App\Http\Controllers;

use App\Events\MessageDelivered;
use App\Message;
use Illuminate\Http\Request;
use App\User;
class MessageController extends Controller
{
    public function __construct()
    {
    }
    public function index()
    {
        $user =User::all();
        $messages = Message::all();
        return view('messages.index',compact('messages','user') );
    }


    public function store(Request $request)
    {
         $message =auth()->user()->messages()->create($request->all());
        broadcast(new MessageDelivered($message->load('user')))->toOthers();
    }
}
