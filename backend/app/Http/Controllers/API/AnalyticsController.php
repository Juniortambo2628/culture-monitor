<?php
 
namespace App\Http\Controllers\Api;
 
use App\Http\Controllers\Controller;
use App\Models\Response;
use App\Models\Poll;
use App\Models\Organization;
use App\Models\Factor;
use App\Models\Question;
use App\Models\User;
use App\Models\Profile;
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
        $organizationId = $request->query('organization_id');
        
        $query = Poll::where('status', 'closed')
            ->orderBy('year')
            ->orderBy('quarter');
            
        if ($organizationId) {
            $query->where('organization_id', $organizationId);
        }
 
        $polls = $query->get();
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
                'target' => 8.5 
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
        $organizationId = $request->query('organization_id');
 
        if (!$pollId) {
            $query = Poll::whereIn('status', ['active', 'closed']);
            if ($organizationId) $query->where('organization_id', $organizationId);
            $pollId = $query->orderBy('id', 'desc')->first()?->id;
        }
 
        if (!$pollId) return response()->json([]);
 
        $factors = Factor::query();
        if ($organizationId) {
            $factors->where('organization_id', $organizationId);
        }
        $factors = $factors->get();
        
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
        $organizationId = $request->query('organization_id');
 
        if (!$pollId) {
            $query = Poll::whereIn('status', ['active', 'closed']);
            if ($organizationId) $query->where('organization_id', $organizationId);
            $pollId = $query->orderBy('id', 'desc')->first()?->id;
        }
 
        if (!$pollId) return response()->json([]);
 
        $responses = Response::where('poll_id', $pollId)
            ->with('user.profile')
            ->get();
 
        $matrix = [];
        foreach ($responses as $response) {
            $dept = $response->user->profile->department ?? 'General';
            if (!isset($matrix[$dept])) {
                $matrix[$dept] = ['total' => 0, 'count' => 0];
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
     * Get Real-Time Meter (Pie Chart)
     */
    public function getMeter(Request $request)
    {
        $pollId = $request->query('poll_id');
        $organizationId = $request->query('organization_id');
        
        if (!$pollId) {
            $query = Poll::whereIn('status', ['active', 'closed']);
            if ($organizationId) $query->where('organization_id', $organizationId);
            $pollId = $query->orderBy('id', 'desc')->first()?->id;
        }
 
        if (!$pollId) return response()->json(['score' => 0, 'raw' => 0]);
 
        $responses = Response::where('poll_id', $pollId)->get();
        if ($responses->isEmpty()) return response()->json(['score' => 0, 'raw' => 0]);
 
        $total = 0;
        $count = 0;
        foreach ($responses as $res) {
            foreach ($res->answers as $score) {
                $total += floatval($score);
                $count++;
            }
        }
 
        return response()->json([
            'score' => $count > 0 ? round(($total / $count) * 10, 0) : 0, // Scaled to 100 for Pie
            'raw' => $count > 0 ? round($total / $count, 1) : 0
        ]);
    }
 
    /**
     * Get Segment Comparisons (Bar Chart) - with segment filtering
     */
    public function getSegmentComparisons(Request $request)
    {
        $pollId = $request->query('poll_id');
        $organizationId = $request->query('organization_id');
        $segmentType = $request->query('segment_type', 'department');
        $segments = $request->query('segments');

        if (!$pollId) {
            $query = Poll::whereIn('status', ['active', 'closed']);
            if ($organizationId) $query->where('organization_id', $organizationId);
            $pollId = $query->orderBy('id', 'desc')->first()?->id;
        }
        if (!$pollId) return response()->json([]);

        $responses = Response::where('poll_id', $pollId)->with('user.profile')->get();
        $fieldMap = ['department'=>'department','gender'=>'gender','generation'=>'generation','job_level'=>'job_level','job_status'=>'employment_status','location'=>'location'];
        $field = $fieldMap[$segmentType] ?? 'department';
        $selectedSegments = $segments ? explode(',', $segments) : null;

        $matrix = [];
        foreach ($responses as $response) {
            $profile = $response->user->profile ?? null;
            if (!$profile) continue;
            $segmentValue = $profile->$field ?? 'Unknown';
            if ($selectedSegments && !in_array($segmentValue, $selectedSegments)) continue;
            if (!isset($matrix[$segmentValue])) $matrix[$segmentValue] = ['total'=>0,'count'=>0];
            foreach ($response->answers as $score) {
                $matrix[$segmentValue]['total'] += floatval($score);
                $matrix[$segmentValue]['count']++;
            }
        }

        $finalData = [];
        foreach ($matrix as $seg => $data) {
            $finalData[] = ['name'=>$seg, 'score'=>$data['count']>0 ? round($data['total']/$data['count'],1) : 0];
        }
        return response()->json($finalData);
    }
 
    /**
     * Get Factor Analysis by Segment (Line Chart) - with segment filtering
     */
    public function getFactorBySegment(Request $request)
    {
        $organizationId = $request->query('organization_id');
        $pollId = $request->query('poll_id');
        $segmentType = $request->query('segment_type', 'department');
        $segments = $request->query('segments');

        if (!$pollId) {
            $query = Poll::whereIn('status', ['active', 'closed']);
            if ($organizationId) $query->where('organization_id', $organizationId);
            $pollId = $query->orderBy('id', 'desc')->first()?->id;
        }
        if (!$pollId) return response()->json([]);

        $factorsQuery = Factor::query();
        if ($organizationId) $factorsQuery->where('organization_id', $organizationId);
        $factors = $factorsQuery->get();

        $responses = Response::where('poll_id', $pollId)->with('user.profile')->get();
        $fieldMap = ['department'=>'department','gender'=>'gender','generation'=>'generation','job_level'=>'job_level','job_status'=>'employment_status','location'=>'location'];
        $field = $fieldMap[$segmentType] ?? 'department';
        $selectedSegments = $segments ? explode(',', $segments) : null;

        $group1 = collect(); $group2 = collect();
        foreach ($responses as $res) {
            $profile = $res->user->profile ?? null;
            if (!$profile) continue;
            $segValue = $profile->$field ?? '';
            if ($selectedSegments && count($selectedSegments)>=2) {
                if ($segValue===$selectedSegments[0]) $group1->push($res);
                elseif ($segValue===$selectedSegments[1]) $group2->push($res);
            } elseif ($selectedSegments && count($selectedSegments)===1) {
                if ($segValue===$selectedSegments[0]) $group1->push($res);
                else $group2->push($res);
            } else {
                if ($group1->count()<=$group2->count()) $group1->push($res);
                else $group2->push($res);
            }
        }

        $data = [];
        foreach ($factors as $factor) {
            $questions = Question::where('poll_id', $pollId)->where('factor_id', $factor->id)->pluck('id');
            $s1T=0;$s1C=0;$s2T=0;$s2C=0;
            foreach ($group1 as $r) { foreach ($questions as $q) { if (isset($r->answers[$q])) { $s1T+=floatval($r->answers[$q]); $s1C++; } } }
            foreach ($group2 as $r) { foreach ($questions as $q) { if (isset($r->answers[$q])) { $s2T+=floatval($r->answers[$q]); $s2C++; } } }
            $data[] = ['label'=>substr($factor->name,0,5), 's1'=>$s1C>0?round($s1T/$s1C,1):0, 's2'=>$s2C>0?round($s2T/$s2C,1):0];
        }
        return response()->json($data);
    }

    /**
     * Get Participants who responded to polls (for PCR tab)
     */
    public function getParticipants(Request $request)
    {
        $organizationId = $request->query('organization_id');
        $pollId = $request->query('poll_id');
        $query = Response::with('user.profile');
        if ($pollId) $query->where('poll_id', $pollId);
        elseif ($organizationId) $query->whereHas('poll', fn($q)=>$q->where('organization_id', $organizationId));

        $responses = $query->get();
        $seen = []; $participants = [];
        foreach ($responses as $res) {
            $user = $res->user;
            if (!$user || isset($seen[$user->id])) continue;
            $seen[$user->id] = true;
            $profile = $user->profile;
            $participants[] = [
                'id'=>$user->id, 'first_name'=>$user->name??'User', 'last_name'=>$profile->last_name??'',
                'department'=>$profile->department??'--', 'location'=>$profile->location??'--',
                'job_level'=>$profile->job_level??'--', 'gender'=>$profile->gender??'--', 'generation'=>$profile->generation??'--',
            ];
        }
        return response()->json($participants);
    }

    /**
     * Get Personal Culture Reading for a specific user
     */
    public function getPersonalReading(Request $request)
    {
        $userId = $request->query('user_id');
        $pollId = $request->query('poll_id');
        $organizationId = $request->query('organization_id');
        if (!$userId) return response()->json(['error'=>'user_id required'], 400);

        if (!$pollId) {
            $query = Poll::whereIn('status', ['active', 'closed']);
            if ($organizationId) $query->where('organization_id', $organizationId);
            $pollId = $query->orderBy('id', 'desc')->first()?->id;
        }
        if (!$pollId) return response()->json(['meter'=>0,'cm_meter'=>0,'radar'=>[],'segments'=>[]]);

        $userResponse = Response::where('poll_id', $pollId)->where('user_id', $userId)->first();
        if (!$userResponse) return response()->json(['meter'=>0,'cm_meter'=>0,'radar'=>[],'segments'=>[]]);

        $userTotal=0; $userCount=0;
        foreach ($userResponse->answers as $score) { $userTotal+=floatval($score); $userCount++; }
        $pcrScore = $userCount>0 ? round($userTotal/$userCount,1) : 0;

        $allResponses = Response::where('poll_id', $pollId)->get();
        $cmTotal=0; $cmCount=0;
        foreach ($allResponses as $r) { foreach ($r->answers as $s) { $cmTotal+=floatval($s); $cmCount++; } }
        $cmScore = $cmCount>0 ? round($cmTotal/$cmCount,1) : 0;

        $factors = Factor::query();
        if ($organizationId) $factors->where('organization_id', $organizationId);
        $factors = $factors->get();

        $radarData = [];
        foreach ($factors as $factor) {
            $questions = Question::where('poll_id', $pollId)->where('factor_id', $factor->id)->pluck('id');
            $fT=0;$fC=0;
            foreach ($questions as $qId) { if (isset($userResponse->answers[$qId])) { $fT+=floatval($userResponse->answers[$qId]); $fC++; } }
            $radarData[] = ['subject'=>$factor->name, 'A'=>$fC>0?round($fT/$fC,1):0, 'fullMark'=>10];
        }

        $userProfile = $userResponse->user->profile;
        if (!$userProfile) return response()->json(['meter'=>$pcrScore, 'cm_meter'=>$cmScore, 'radar'=>$radarData, 'segments'=>[]]);

        $demoCategories = [
            'Department' => $userProfile->department,
            'Location' => $userProfile->location,
            'Job Level' => $userProfile->job_level,
        ];

        $segmentData = [];
        $segmentData[] = ['name' => 'Your Profile', 'score' => $pcrScore, 'isUser' => true];

        foreach ($demoCategories as $label => $value) {
            if (!$value) continue;
            
            // Get average for others in this demographic
            $field = str_replace(' ', '_', strtolower($label));
            $ids = Profile::where($field, $value)->pluck('user_id');
            $responses = Response::where('poll_id', $pollId)->whereIn('user_id', $ids)->get();
            
            $total = 0; $count = 0;
            foreach ($responses as $res) {
                foreach ($res->answers as $score) {
                    $total += floatval($score);
                    $count++;
                }
            }
            $avg = $count > 0 ? round($total / $count, 1) : 0;
            $segmentData[] = ['name' => $label, 'score' => $avg, 'isUser' => false];
        }

        return response()->json(['meter'=>$pcrScore, 'cm_meter'=>$cmScore, 'radar'=>$radarData, 'segments'=>$segmentData]);
    }
 
    /**
     * Get Statistics for various Admin Modules
     */
    public function getModuleStats(Request $request)
    {
        $module = $request->query('module', 'dashboard');
        $organizationId = $request->query('organization_id');
 
        $pollQuery = Poll::query();
        $responseQuery = Response::query();
 
        if ($organizationId) {
            $pollQuery->where('organization_id', $organizationId);
            $responseQuery->whereHas('poll', function($q) use ($organizationId) {
                $q->where('organization_id', $organizationId);
            });
        }
 
        if ($module === 'polls') {
            return response()->json([
                ['name' => 'Total Polls', 'value' => $pollQuery->count(), 'trend' => '+2', 'description' => 'Organization scope', 'variant' => 'default'],
                ['name' => 'Active Surveys', 'value' => (clone $pollQuery)->where('status', 'active')->count(), 'trend' => '0', 'description' => 'Currently live', 'variant' => 'teal'],
                ['name' => 'Drafts', 'value' => (clone $pollQuery)->where('status', 'draft')->count(), 'trend' => '-1', 'description' => 'Pending launch', 'variant' => 'amber'],
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
 
        // Default Dashboard Stats
        return response()->json([
            ['name' => 'Organizations', 'value' => $organizationId ? 1 : Organization::count(), 'trend' => '0', 'description' => 'Context scope', 'variant' => 'default'],
            ['name' => 'Participants', 'value' => $responseQuery->distinct('user_id')->count(), 'trend' => '+15', 'description' => 'Total unique', 'variant' => 'teal'],
            ['name' => 'Active Polls', 'value' => (clone $pollQuery)->where('status', 'active')->count(), 'trend' => '0', 'description' => 'Live surveys', 'variant' => 'amber'],
            ['name' => 'Latest CHI', 'value' => '7.4', 'trend' => '+0.3', 'description' => 'Org average', 'variant' => 'default'],
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

    /**
     * Get Organization Comparison (Benchmarking)
     */
    public function getOrganizationComparison(Request $request)
    {
        $orgIds = $request->query('org_ids');
        if (!$orgIds) {
            $orgIds = Organization::limit(3)->pluck('id')->toArray();
        } elseif (is_string($orgIds)) {
            $orgIds = explode(',', $orgIds);
        }

        $organizations = Organization::whereIn('id', $orgIds)->get();
        if ($organizations->isEmpty()) return response()->json(['organizations' => [], 'trends' => []]);

        // Get common periods
        $periods = Poll::select('year', 'quarter')
            ->distinct()
            ->orderBy('year')
            ->orderBy('quarter')
            ->get();

        $data = [];
        
        foreach ($periods as $period) {
            $periodLabel = "{$period->year} Q{$period->quarter}";
            $periodData = ['period' => $periodLabel];

            foreach ($organizations as $org) {
                $poll = Poll::where('organization_id', $org->id)
                    ->where('year', $period->year)
                    ->where('quarter', $period->quarter)
                    ->whereIn('status', ['active', 'closed'])
                    ->first();
                
                $avg = null;
                if ($poll) {
                    $responses = Response::where('poll_id', $poll->id)->get();
                    if ($responses->isNotEmpty()) {
                        $total = 0;
                        $count = 0;
                        foreach ($responses as $res) {
                            foreach ($res->answers as $score) {
                                $total += floatval($score);
                                $count++;
                            }
                        }
                        if ($count > 0) $avg = round($total / $count, 2);
                    }
                }
                
                $periodData[$org->name] = $avg;
            }
            $data[] = $periodData;
        }

        return response()->json([
            'organizations' => $organizations->pluck('name'),
            'trends' => $data
        ]);
    }
}
