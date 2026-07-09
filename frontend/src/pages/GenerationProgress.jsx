import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Loader2, ChevronDown, ChevronUp, CheckCircle2, Circle, AlertCircle } from 'lucide-react'
import GenerationStatusBadge from '../components/GenerationStatusBadge'

function ProgressStep({ title, status, description, children, defaultExpanded = false }) {
  const [expanded, setExpanded] = useState(defaultExpanded)
  
  return (
    <div className="border border-slate-200 rounded-xl mb-4 overflow-hidden bg-white shadow-sm transition-all duration-200">
       <div 
         className={`p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors ${status === 'current' ? 'bg-indigo-50/50' : ''}`}
         onClick={() => setExpanded(!expanded)}
       >
         <div className="flex items-center gap-4">
            {status === 'completed' && <CheckCircle2 className="text-green-500 w-7 h-7 flex-shrink-0" />}
            {status === 'current' && <Loader2 className="text-indigo-500 w-7 h-7 animate-spin flex-shrink-0" />}
            {status === 'waiting' && <Circle className="text-slate-300 w-7 h-7 flex-shrink-0" />}
            {status === 'failed' && <AlertCircle className="text-red-500 w-7 h-7 flex-shrink-0" />}
            <div>
              <h3 className={`font-semibold text-lg ${status === 'waiting' ? 'text-slate-500' : 'text-slate-900'}`}>{title}</h3>
              <p className="text-sm text-slate-500">{description}</p>
            </div>
         </div>
         <div className="text-slate-400 pl-4">
            {expanded ? <ChevronUp /> : <ChevronDown />}
         </div>
       </div>
       
       {expanded && children && (
         <div className="p-5 bg-slate-50 border-t border-slate-100 text-sm text-slate-700">
           {children}
         </div>
       )}
    </div>
  )
}

export default function GenerationProgress() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [jobData, setJobData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let intervalId

    const fetchStatus = async () => {
      try {
        const response = await fetch(`/api/generation/${id}/status`)
        if (!response.ok) throw new Error(`Failed to fetch status: ${response.statusText}`)
        
        const json = await response.json()
        if (json.success) {
          setJobData(json.data)
          if (json.data.status === 'COMPLETED' || json.data.status === 'FAILED') {
            clearInterval(intervalId)
          }
        } else {
          throw new Error(json.message || 'Error parsing job status')
        }
      } catch (err) {
        setError(err.message)
        clearInterval(intervalId)
      } finally {
        setLoading(false)
      }
    }

    fetchStatus()
    intervalId = setInterval(fetchStatus, 3000)
    return () => clearInterval(intervalId)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-slate-500 mb-4" />
        <p className="text-slate-600 font-medium">Fetching job details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-slate-50">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-red-200 p-8 space-y-4 text-center">
          <h2 className="text-xl font-bold text-red-700">Unable to Load Job</h2>
          <p className="text-slate-600">{error}</p>
          <button 
            onClick={() => navigate('/creator/generation')}
            className="inline-block mt-4 px-4 py-2 bg-slate-200 text-slate-800 text-sm font-medium rounded-md hover:bg-slate-300"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  const p = jobData?.progress || 0
  const isFailed = jobData?.status === 'FAILED'
  const isCompleted = jobData?.status === 'COMPLETED'

  // Determine step statuses
  const step1Status = isFailed ? 'failed' : (p >= 25 ? 'completed' : 'current')
  const step2Status = isFailed && p >= 25 ? 'failed' : (p >= 60 ? 'completed' : (p >= 25 ? 'current' : 'waiting'))
  const step3Status = isFailed && p >= 60 ? 'failed' : (p >= 100 || isCompleted ? 'completed' : (p >= 60 ? 'current' : 'waiting'))

  const sceneSegments = jobData?.song?.sceneSegments || []

  return (
    <div className="min-h-[80vh] flex flex-col items-center p-8 bg-slate-50">
      <div className="w-full max-w-3xl space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center space-y-4 relative">
          <button 
            onClick={() => navigate('/creator/generation')}
            className="absolute top-8 left-8 text-sm text-slate-500 hover:text-slate-800"
          >
            &larr; Back
          </button>
          
          <h2 className="text-2xl font-bold text-slate-900">
            {jobData?.song?.title || 'Unknown Project'}
          </h2>
          <div className="flex justify-center">
            <GenerationStatusBadge status={jobData?.status} errorMessage={jobData?.errorMessage} className="scale-110" />
          </div>
          {isCompleted && (
            <p className="text-green-600 font-medium pt-2">Your cinematic video has been assembled successfully!</p>
          )}
        </div>

        {/* Steps */}
        <div className="space-y-4">
          <ProgressStep 
            title="Phase 1: Audio Extraction & Validation" 
            description="Downloading MP3, verifying Cloudinary upload, and checking database constraints."
            status={step1Status}
          >
             <div className="flex items-center gap-2 text-green-600">
               <CheckCircle2 className="w-4 h-4" />
               <span>Audio successfully secured in cloud storage.</span>
             </div>
          </ProgressStep>

          <ProgressStep 
            title="Phase 2: AI Scene Planning" 
            description="LLM is reading your lyrics and generating precise prompts for the image generator."
            status={step2Status}
            defaultExpanded={p >= 25}
          >
            {sceneSegments.length > 0 ? (
              <div className="space-y-4">
                <p className="font-medium text-slate-900 mb-2">Generated {sceneSegments.length} scenes:</p>
                <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
                  {sceneSegments.map((scene, idx) => (
                    <div key={scene.id} className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <span className="font-bold text-indigo-600 text-lg">Scene {idx + 1}</span>
                        <span className="text-sm font-mono bg-slate-100 px-3 py-1 rounded-md text-slate-600">
                          {scene.startTime}s - {scene.endTime}s
                        </span>
                      </div>
                      <p className="text-base italic text-slate-600 border-l-4 border-indigo-200 pl-4 mb-4">
                        "{scene.lyrics}"
                      </p>
                      <div className="bg-slate-50 p-4 rounded-md border border-slate-100">
                        <span className="font-semibold text-slate-500 text-xs uppercase tracking-wider block mb-2">Visual Prompt</span>
                        <p className="text-sm text-slate-800 leading-relaxed">
                          {scene.visualPrompt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
               <p className="py-4 text-center text-slate-500 animate-pulse">Waiting for scene generation to complete...</p>
            )}
          </ProgressStep>

          <ProgressStep 
            title="Phase 3: Image Generation & Video Assembly" 
            description="Generating images with DALL-E and stitching everything together with FFmpeg."
            status={step3Status}
            defaultExpanded={isCompleted}
          >
             {isCompleted ? (
               <div className="flex flex-col items-center justify-center py-6 space-y-4 text-center">
                 <CheckCircle2 className="w-12 h-12 text-green-500" />
                 <p className="text-slate-800 font-medium">Generation complete!</p>
                 <button 
                   onClick={() => navigate('/creator/generation')}
                   className="mt-4 px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                 >
                   Return to Dashboard
                 </button>
               </div>
             ) : (
               <div className="flex items-center gap-3 justify-center py-8">
                 <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                 <p className="text-slate-600">Generating frames and compiling video... This is the longest step.</p>
               </div>
             )}
          </ProgressStep>
        </div>

      </div>
    </div>
  )
}
