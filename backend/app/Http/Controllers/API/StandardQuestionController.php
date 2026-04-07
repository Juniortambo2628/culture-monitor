<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\StandardQuestion;

class StandardQuestionController extends Controller
{
    public function index(Request $request)
    {
        $factorNames = $request->query('factors');
        if (!$factorNames) return response()->json([]);

        $names = explode(',', $factorNames);
        $questions = StandardQuestion::whereIn('factor_name', $names)->get();

        return response()->json($questions);
    }
}
