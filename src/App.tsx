import { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion } from 'motion/react';
import { Sparkles, Briefcase, Target, Clock, AlertCircle, Building2, Users, Coins, Heart, Send, Loader2, Key, HelpCircle, X, History, CircleDollarSign } from 'lucide-react';

// Patch Notes Data
const PATCH_NOTES = [
  { version: 'v1.6.0', date: '2026.04.19', content: '운영 정보 강화: 패치노트 시스템 구축 및 예상 API 사용 비용 안내 추가' },
  { version: 'v1.5.0', date: '2026.03.28', content: '공유성 개선: 링크 공유 시 SEO 최적화 및 메타 태그(OG Tag) 반영' },
  { version: 'v1.4.0', date: '2026.03.28', content: '범용성 확대: 외부 웹 배포 시 커스텀 API Key 직접 입력 및 저장 기능 추가' },
  { version: 'v1.3.0', date: '2026.03.28', content: '도움말 창 추가: 사용자 가이드(사용방법) 모달 구현' },
  { version: 'v1.2.0', date: '2026.03.16', content: '시각적 편의성 개선: 상단 히어로 이미지 추가 및 AI Studio API Key 연동 기능 구현' },
  { version: 'v1.1.0', date: '2026.03.16', content: '개인용 개편: 직원(개인) 관점으로 프로젝트 전면 개편' },
  { version: 'v1.0.0', date: '2026.03.16', content: '서비스 런칭: 혁신 직무역량 강화 AI 초기 빌드 배포' },
];

// Initialize Gemini API is deferred to handleSubmit to support dynamic API keys

export default function App() {
  const [formData, setFormData] = useState({
    department: '',
    currentRole: '',
    careerGoals: '',
    targetCompetencies: '',
    painPoints: '',
    availableTime: '',
    duration: '',
    learningStyle: '',
  });

  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isHowToUseOpen, setIsHowToUseOpen] = useState(false);
  const [isPatchNotesOpen, setIsPatchNotesOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('GEMINI_API_KEY') || '');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult('');

    try {
      const apiKey = customApiKey || (process.env as any).API_KEY || process.env.GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API 키가 설정되지 않았습니다. 우측 상단의 버튼을 통해 API 키를 삽입해 주세요.');
      }
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
당신은 세계 최고 수준의 커리어 코치 및 직무역량 개발 전문가입니다.
다음은 한 직원이 자신의 직무역량을 강화하기 위해 제공한 정보입니다.

[직원 정보]
- 소속 부서 및 직급: ${formData.department}
- 현재 담당 주요 업무: ${formData.currentRole}
- 개인 커리어 목표: ${formData.careerGoals}
- 강화하고 싶은 핵심 역량: ${formData.targetCompetencies}
- 업무 수행 중 겪는 어려움: ${formData.painPoints}
- 주당 자기계발 가능 시간: ${formData.availableTime}
- 희망하는 로드맵 기간: ${formData.duration}
- 선호하는 학습 방식: ${formData.learningStyle}

위 정보를 바탕으로, 이 직원의 직무역량을 획기적으로 강화하고 커리어 목표를 달성할 수 있는 **자세한 아이디어**와 **개인 맞춤형 실행 로드맵**을 작성해 주세요.
결과물은 다음 조건을 반드시 충족해야 합니다:
1. **쉽고 디테일하게**: 누구나 이해하고 바로 실천할 수 있도록 구체적인 액션 아이템 단위로 작성하세요.
2. **납득 가능한 결과물**: 제안된 로드맵을 꾸준히 실행했을 때 실제 업무 성과와 커리어 성장에 유의미한 결과가 나올 수밖에 없도록 논리적으로 작성하세요.
3. **구조화된 형식**: 마크다운을 사용하여 가독성 좋게 구조화하세요 (예: 1단계, 2단계, 주차별/월별 로드맵, 기대 효과 등).
4. **실무 밀착형 접근**: 단순 이론 공부를 넘어, 실제 업무에 즉시 적용 가능한 방식(예: 사이드 프로젝트, 사내 멘토링, 업무 자동화 툴 도입, 마이크로러닝 등)을 포함하세요.
`;

      const response = await ai.models.generateContentStream({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
      });

      let fullText = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullText += chunk.text;
          setResult(fullText);
        }
      }
    } catch (err) {
      console.error(err);
      setError('결과를 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-red-600/30">
      {/* Header */}
      <header className="border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg text-zinc-950">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                혁신 직무역량 강화 AI
              </h1>
              <p className="text-sm text-zinc-400">개인의 잠재력을 극대화하는 맞춤형 커리어 로드맵</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-200/70">
              <CircleDollarSign className="w-3.5 h-3.5 text-amber-500" />
              <span>예상 비용(1회): ₩10 ~ ₩150 (결과물에 따라 오차 발생 가능)</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPatchNotesOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg border border-zinc-700 transition-colors"
                title="업데이트 내역"
              >
                <History className="w-4 h-4" />
                패치노트
              </button>
              <button
                onClick={() => setIsHowToUseOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg border border-zinc-700 transition-colors"
              >
                <HelpCircle className="w-4 h-4" />
                사용방법
              </button>
              <button
                onClick={async () => {
                if ((window as any).aistudio?.openSelectKey) {
                  await (window as any).aistudio.openSelectKey();
                } else {
                  setIsApiKeyModalOpen(true);
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-sm font-medium rounded-lg border border-zinc-700 transition-colors"
            >
              <Key className="w-4 h-4" />
              API Key 삽입
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-zinc-700/50">
              <span className="text-sm text-zinc-400">개발자</span>
              <span className="text-sm font-medium text-red-400">정혁신</span>
            </div>
          </div>
        </div>
      </div>
    </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Hero Image Section */}
        <div className="w-full mb-12">
          <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl shadow-black/50 border border-zinc-800 group">
            <img
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop"
              alt="혁신 직무역량 강화 AI 배경"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-medium text-zinc-200">AI-Powered Career Growth</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 drop-shadow-lg">
                  혁신 직무역량 강화 <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">AI</span>
                </h2>
                <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto font-medium drop-shadow-md">
                  당신의 잠재력을 깨우고 커리어의 새로운 패러다임을 제시합니다
                </p>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form Section */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl shadow-black/50">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-white">
                <Target className="w-5 h-5 text-red-500" />
                나의 직무 현황 분석
              </h2>
              <p className="text-sm text-zinc-400 mb-6">
                AI가 최적의 개인 맞춤형 로드맵을 설계할 수 있도록 아래 항목들을 최대한 자세히 입력해 주세요.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-4">
                  <InputField
                    icon={<Building2 className="w-4 h-4" />}
                    label="소속 부서 및 직급"
                    name="department"
                    placeholder="예: 마케팅팀 대리, 백엔드 개발 파트장"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                  <TextAreaField
                    icon={<Briefcase className="w-4 h-4" />}
                    label="현재 담당 주요 업무"
                    name="currentRole"
                    placeholder="예: 퍼포먼스 마케팅 캠페인 운영, API 서버 개발 및 유지보수"
                    value={formData.currentRole}
                    onChange={handleInputChange}
                  />
                  <TextAreaField
                    icon={<Target className="w-4 h-4" />}
                    label="개인 커리어 목표"
                    name="careerGoals"
                    placeholder="예: 3년 내 데이터 기반 마케팅 리더로 성장, 풀스택 개발자로 전향"
                    value={formData.careerGoals}
                    onChange={handleInputChange}
                  />
                  <TextAreaField
                    icon={<Sparkles className="w-4 h-4" />}
                    label="강화하고 싶은 핵심 역량"
                    name="targetCompetencies"
                    placeholder="예: 파이썬 데이터 분석 능력, 최신 AI 툴 활용 능력, 영어 프레젠테이션"
                    value={formData.targetCompetencies}
                    onChange={handleInputChange}
                  />
                  <TextAreaField
                    icon={<AlertCircle className="w-4 h-4" />}
                    label="업무 수행 중 겪는 어려움"
                    name="painPoints"
                    placeholder="예: 단순 반복 업무가 많아 학습 시간이 부족함, 사내에 물어볼 시니어가 없음"
                    value={formData.painPoints}
                    onChange={handleInputChange}
                  />
                  <InputField
                    icon={<Clock className="w-4 h-4" />}
                    label="주당 자기계발 가능 시간"
                    name="availableTime"
                    placeholder="예: 주 5시간, 출퇴근 시간 활용 1시간씩"
                    value={formData.availableTime}
                    onChange={handleInputChange}
                  />
                  <InputField
                    icon={<Clock className="w-4 h-4" />}
                    label="희망하는 로드맵 기간"
                    name="duration"
                    placeholder="예: 3개월 단기 집중, 6개월 장기 프로젝트"
                    value={formData.duration}
                    onChange={handleInputChange}
                  />
                  <TextAreaField
                    icon={<Heart className="w-4 h-4" />}
                    label="선호하는 학습 방식"
                    name="learningStyle"
                    placeholder="예: 실무 프로젝트 기반 학습, 온라인 영상 강의 시청, 1:1 멘토링"
                    value={formData.learningStyle}
                    onChange={handleInputChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-red-900/20"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      AI 로드맵 설계 중...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      맞춤형 로드맵 생성하기
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Result Section */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8 min-h-[600px] shadow-xl shadow-black/50 relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

              {error && (
                <div className="p-4 bg-red-950/50 border border-red-900 rounded-xl text-red-400 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {!result && !isLoading && !error && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-zinc-500 py-20">
                  <div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-4 border border-zinc-700/50">
                    <Sparkles className="w-8 h-8 text-amber-500/50" />
                  </div>
                  <h3 className="text-xl font-medium text-zinc-300">AI 컨설팅 대기 중</h3>
                  <p className="max-w-sm">
                    좌측 폼에 현재 직무 현황을 입력하고 생성하기 버튼을 누르면, 개인 맞춤형 직무역량 강화 로드맵이 이곳에 표시됩니다.
                  </p>
                </div>
              )}

              {isLoading && !result && (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-zinc-800 rounded-full"></div>
                    <div className="w-16 h-16 border-4 border-amber-500 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
                  </div>
                  <p className="text-amber-400 font-medium animate-pulse">개인 직무 데이터를 분석하고 최적의 성장 전략을 도출하고 있습니다...</p>
                </div>
              )}

              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative z-10"
                >
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-zinc-800">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Target className="w-6 h-6 text-amber-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">직무역량 강화 실행 로드맵</h2>
                  </div>
                  <div className="prose prose-invert prose-zinc max-w-none
                    prose-headings:text-amber-400 prose-headings:font-bold
                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-zinc-300 prose-p:leading-relaxed
                    prose-li:text-zinc-300
                    prose-strong:text-white prose-strong:font-semibold
                    prose-a:text-red-400 hover:prose-a:text-red-300
                    prose-blockquote:border-l-amber-500 prose-blockquote:bg-zinc-800/30 prose-blockquote:py-1 prose-blockquote:px-4 prose-blockquote:rounded-r-lg
                    prose-hr:border-zinc-800
                    prose-code:text-amber-200 prose-code:bg-amber-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md
                    prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800"
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{result}</ReactMarkdown>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* How to Use Modal */}
      {isHowToUseOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"
          >
            <button
              onClick={() => setIsHowToUseOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-500" />
              사용방법
            </h3>
            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
              <p>
                <strong className="text-amber-400">1. API Key 삽입:</strong> 우측 상단의 'API Key 삽입' 버튼을 클릭하여 발급받은 Gemini API 키를 연동합니다.
              </p>
              <p>
                <strong className="text-amber-400">2. 직무 현황 입력:</strong> 좌측 폼에 현재 소속, 담당 업무, 커리어 목표 등 본인의 직무 현황을 최대한 상세하게 입력합니다.
              </p>
              <p>
                <strong className="text-amber-400">3. 로드맵 생성:</strong> 하단의 '맞춤형 로드맵 생성하기' 버튼을 클릭합니다.
              </p>
              <p>
                <strong className="text-amber-400">4. 결과 확인:</strong> AI가 분석한 개인 맞춤형 직무역량 강화 아이디어와 구체적인 실행 로드맵을 우측 화면에서 확인하고 실무에 적용해 보세요.
              </p>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsHowToUseOpen(false)}
                className="px-6 py-2 bg-red-600 hover:bg-red-500 text-white font-medium rounded-lg transition-colors"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Patch Notes Modal */}
      {isPatchNotesOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"
          >
            <button
              onClick={() => setIsPatchNotesOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <History className="w-5 h-5 text-red-500" />
              업데이트 패치노트
            </h3>
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {PATCH_NOTES.map((note, idx) => (
                <div key={idx} className="relative pl-6 pb-6 border-l border-zinc-800 last:pb-0">
                  <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-lg font-bold text-white leading-none">{note.version}</span>
                    <span className="text-xs text-zinc-500 font-mono">{note.date}</span>
                  </div>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {note.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setIsPatchNotesOpen(false)}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
              >
                닫기
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* API Key Modal */}
      {isApiKeyModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative"
          >
            <button
              onClick={() => setIsApiKeyModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Key className="w-5 h-5 text-amber-500" />
              Google Gemini API Key 설정
            </h3>
            <div className="space-y-4 text-zinc-300 text-sm leading-relaxed">
              <p>
                웹 배포 환경에서는 직접 발급받은 Gemini API 키를 입력해야 합니다. 입력된 키는 브라우저에만 안전하게 저장됩니다.
              </p>
              <input
                type="password"
                value={customApiKey}
                onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
              />
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => setIsApiKeyModalOpen(false)}
                className="px-6 py-2 bg-zinc-800 hover:bg-zinc-700 text-white font-medium rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  localStorage.setItem('GEMINI_API_KEY', customApiKey);
                  setIsApiKeyModalOpen(false);
                }}
                className="px-6 py-2 bg-amber-600 hover:bg-amber-500 text-white font-medium rounded-lg transition-colors"
              >
                저장
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function InputField({ icon, label, name, placeholder, value, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
        <span className="text-zinc-500">{icon}</span>
        {label}
      </label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
      />
    </div>
  );
}

function TextAreaField({ icon, label, name, placeholder, value, onChange }: any) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-zinc-300">
        <span className="text-zinc-500">{icon}</span>
        {label}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all resize-none"
      />
    </div>
  );
}
