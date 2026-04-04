<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Response;
use App\Models\Poll;
use App\Models\Organization;
use App\Models\Factor;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class AnalyticsController extends Controller
{
    /**
     * Get Overall Culture Trends (Quarterly Timeline)
     */
    public function getTrends(Request $request)
    {
        $organizationId = $request->query('organization_id', 1);

        $polls = Poll::where('organization_id', $organizationId)
            ->where('status', 'closed')
            ->orderBy('year')
            ->orderBy('quarter')
            ->get();

        $trends = [];

        foreach ($polls as $poll) {
            $responses = Response::where('poll_id', $poll->id)->get();
            
            if ($responses->isEmpty()) continue;

            $totalScore = 0;
            $count = 0;

            foreach ($responses as $response) {
                $answers = $response->answers;
                if (is_array($answers)) {
                    foreach ($answers as $score) {
                        $totalScore += floatval($score);
                        $count++;
                    }
                }
            }

            $avg = $count > 0 ? round(($totalScore / $count), 2) : 0;

            $trends[] = [
                'period' => "{$poll->year} Q{$poll->quarter}",
                'score' => $avg,
                'target' => 8.5 // Benchmark
            ];
        }

        return response()->json($trends);
    }

    /**
     * Get Factor Comparison (Radar Chart Data)
     */
    public function getFactorRadar(Request $request)
    {
        $pollId = $request->query('poll_id');
        if (!$pollId) {
            $pollId = Poll::where('status', 'closed')->orderBy('id', 'desc')->first()?->id;
        }

        if (!$pollId) return response()->json([]);

        $factors = Factor::all();
        $radarData = [];

        foreach ($factors as $factor) {
            $questions = Question::where('poll_id', $pollId)->where('factor_id', $factor->id)->pluck('id');
            
            if ($questions->isEmpty()) continue;

            $responses = Response::where('poll_id', $pollId)->get();
            $totalFactorScore = 0;
            $count = 0;

            foreach ($responses as $response) {
                $answers = $response->answers;
                foreach ($questions as $qId) {
                    if (isset($answers[$qId])) {
                        $totalFactorScore += floatval($answers[$qId]);
                        $count++;
                    }
                }
            }

            $radarData[] = [
                'subject' => $factor->name,
                'A' => $count > 0 ? round($totalFactorScore / $count, 1) : 0,
                'fullMark' => 10
            ];
        }

        return response()->json($radarData);
    }

    /**
     * Get Segment Heatmap (Heatmap Matrix)
     */
    public function getHeatmap(Request $request)
    {
        $pollId = $request->query('poll_id');
        if (!$pollId) {
            $pollId = Poll::where('status', 'closed')->orderBy('id', 'desc')->first()?->id;
        }

        if (!$pollId) return response()->json([]);

        // Get responses with their user profiles
        $responses = Response::where('poll_id', $pollId)
            ->with('user.profile')
            ->get();

        $matrix = [];
        $depts = [];

        foreach ($responses as $response) {
            $dept = $response->user->profile->department ?? 'General';
            if (!isset($matrix[$dept])) {
                $matrix[$dept] = ['total' => 0, 'count' => 0];
                $depts[] = $dept;
            }

            $answers = $response->answers;
            foreach ($answers as $score) {
                $matrix[$dept]['total'] += floatval($score);
                $matrix[$dept]['count']++;
            }
        }

        $finalData = [];
        foreach ($matrix as $dept => $data) {
            $finalData[] = [
                'name' => $dept,
                'score' => $data['count'] > 0 ? round($data['total'] / $data['count'], 1) : 0
            ];
        }

        return response()->json($finalData);
    }

    /**
     * Get Statistics for various Admin Modules
     */
    public function getModuleStats(Request $request)
    {
        $module = $request->query('module', 'dashboard');

        if ($module === 'polls') {
            return response()->json([
                ['name' => 'Total Polls', 'value' => Poll::count(), 'trend' => '+2', 'description' => 'System wide', 'variant' => 'default'],
                ['name' => 'Active Surveys', 'value' => Poll::where('status', 'active')->count(), 'trend' => '0', 'description' => 'Currently live', 'variant' => 'teal'],
                ['name' => 'Drafts', 'value' => Poll::where('status', 'draft')->count(), 'trend' => '-1', 'description' => 'Pending launch', 'variant' => 'amber'],
                ['name' => 'Avg Completion', 'value' => '84%', 'trend' => '+5', 'description' => 'Target: 90%', 'variant' => 'default'],
            ]);
        }

        if ($module === 'applications') {
            return response()->json([
                ['name' => 'Insights Gen', 'value' => '24', 'trend' => '+8', 'description' => 'Custom reports', 'variant' => 'default'],
                ['name' => 'Active Audits', 'value' => '3', 'trend' => '+1', 'description' => 'Strategic level', 'variant' => 'teal'],
                ['name' => 'Pending Sync', 'value' => '1', 'trend' => '-2', 'description' => 'Data pipeline', 'variant' => 'amber'],
                ['name' => 'Impact Score', 'value' => '9.1', 'trend' => '+0.4', 'description' => 'User rating', 'variant' => 'default'],
            ]);
        }

        if ($module === 'model') {
            return response()->json([
                ['name' => 'Total Factors', 'value' => Factor::count(), 'trend' => '0', 'description' => 'Core dimensions', 'variant' => 'default'],
                ['name' => 'Question Pool', 'value' => Question::count(), 'trend' => '+12', 'description' => 'Verified items', 'variant' => 'teal'],
                ['name' => 'Mean Weight', 'value' => '1.0', 'trend' => '0.0', 'description' => 'Balanced scale', 'variant' => 'default'],
                ['name' => 'Health Index', 'value' => '7.8', 'trend' => '+0.2', 'description' => 'Global avg', 'variant' => 'rose'],
            ]);
        }

        // Default Dashboard Stats
        return response()->json([
            ['name' => 'Organizations', 'value' => Organization::count(), 'trend' => '+1', 'description' => 'Active clients', 'variant' => 'default'],
            ['name' => 'Participants', 'value' => Response::distinct('user_id')->count(), 'trend' => '+15', 'description' => 'Total responses', 'variant' => 'teal'],
            ['name' => 'Active Polls', 'value' => Poll::where('status', 'active')->count(), 'trend' => '0', 'description' => 'Live surveys', 'variant' => 'amber'],
            ['name' => 'Latest CHI', 'value' => '7.4', 'trend' => '+0.3', 'description' => 'System average', 'variant' => 'default'],
        ]);
    }

    /**
     * Simulate Report Generation
     */
    public function generateReport(Request $request)
    {
        $type = $request->input('type', 'general');
        
        // Simulate processing lag
        sleep(1);

        return response()->json([
            'success' => true,
            'report_id' => 'REP-' . strtoupper(Str::random(8)),
            'title' => ucwords(str_replace('_', ' ', $type)) . ' Report',
            'generated_at' => now()->toIso8601String(),
            'download_url' => '#' 
        ]);
    }
}
