import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash, Check, HelpCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Spinner } from '../../components/ui/Spinner';
import { Mcq, TheoryQuestion } from '../../types';

export const QuizManagement: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Quiz Editor State
  const [mcqs, setMcqs] = useState<Mcq[]>([]);
  const [theoryQuestions, setTheoryQuestions] = useState<TheoryQuestion[]>([]);
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizAndLesson = async () => {
      setLoading(true);
      try {
        // Fetch lesson to know the associated courseId so we can navigate back
        const lessonRes = await api.get(`/api/lessons/course/none`); // wait, we can't search none.
        // Let's get the quiz directly first.
        try {
          const quizRes = await api.get(`/api/quiz/lesson/${lessonId}`);
          setMcqs(quizRes.data.mcqs || []);
          setTheoryQuestions(quizRes.data.theoryQuestions || []);
        } catch (err: any) {
          // If 404, we initialize empty lists (quiz doesn't exist yet)
          setMcqs([]);
          setTheoryQuestions([]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizAndLesson();
  }, [lessonId]);

  const handleAddMcq = () => {
    const newMcq: Mcq = {
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
    };
    setMcqs([...mcqs, newMcq]);
  };

  const handleRemoveMcq = (index: number) => {
    setMcqs(mcqs.filter((_, i) => i !== index));
  };

  const handleMcqQuestionChange = (index: number, text: string) => {
    const updated = [...mcqs];
    updated[index].question = text;
    setMcqs(updated);
  };

  const handleMcqOptionChange = (qIndex: number, oIndex: number, text: string) => {
    const updated = [...mcqs];
    updated[qIndex].options[oIndex] = text;
    setMcqs(updated);
  };

  const handleMcqCorrectIndexChange = (qIndex: number, val: number) => {
    const updated = [...mcqs];
    updated[qIndex].correctIndex = val;
    setMcqs(updated);
  };

  const handleAddTheory = () => {
    const newTheory: TheoryQuestion = {
      question: '',
      answer: '',
    };
    setTheoryQuestions([...theoryQuestions, newTheory]);
  };

  const handleRemoveTheory = (index: number) => {
    setTheoryQuestions(theoryQuestions.filter((_, i) => i !== index));
  };

  const handleTheoryQuestionChange = (index: number, text: string) => {
    const updated = [...theoryQuestions];
    updated[index].question = text;
    setTheoryQuestions(updated);
  };

  const handleTheoryAnswerChange = (index: number, text: string) => {
    const updated = [...theoryQuestions];
    updated[index].answer = text;
    setTheoryQuestions(updated);
  };

  const handleSaveQuiz = async () => {
    // Basic verification
    for (let i = 0; i < mcqs.length; i++) {
      const q = mcqs[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      if (q.options.some((o) => !o.trim())) {
        toast.error(`Question ${i + 1} has empty options`);
        return;
      }
    }

    setSaving(true);
    try {
      await api.post('/api/quiz', {
        lessonId,
        mcqs,
        theoryQuestions,
      });
      toast.success('Quiz configured successfully!');
      // Navigate back
      navigate(-1);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to save quiz');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Spinner size="lg" className="my-24" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 text-sm font-semibold"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <Button variant="primary" onClick={handleSaveQuiz} isLoading={saving}>
          <Save className="h-4 w-4 mr-1.5" />
          Save Quiz
        </Button>
      </div>

      <div className="flex flex-col gap-8">
        {/* Section 1: Multiple Choice Questions */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-brand-500" />
              Multiple Choice Questions (MCQs)
            </h2>
            <Button variant="outline" size="sm" onClick={handleAddMcq}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add MCQ
            </Button>
          </div>

          {mcqs.length === 0 ? (
            <Card glass={true} className="text-center py-10 text-slate-500">
              No multiple choice questions added. Students will skip MCQs for this lecture.
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {mcqs.map((q, qIdx) => (
                <Card key={qIdx} glass={true} className="border-slate-800 relative">
                  <button
                    onClick={() => handleRemoveMcq(qIdx)}
                    className="absolute top-6 right-6 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>

                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">
                    Question {qIdx + 1}
                  </h3>

                  <div className="flex flex-col gap-4">
                    <Input
                      label="Question Text *"
                      placeholder="e.g. What is the default port of Spring Boot?"
                      value={q.question}
                      onChange={(e) => handleMcqQuestionChange(qIdx, e.target.value)}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex flex-col gap-1.5">
                          <label className="text-xs text-slate-400 font-semibold flex items-center justify-between">
                            <span>Option {oIdx + 1} *</span>
                            <input
                              type="radio"
                              name={`correct-choice-${qIdx}`}
                              className="h-3.5 w-3.5 accent-brand-500 cursor-pointer"
                              checked={q.correctIndex === oIdx}
                              onChange={() => handleMcqCorrectIndexChange(qIdx, oIdx)}
                            />
                          </label>
                          <Input
                            placeholder={`Option ${oIdx + 1}`}
                            value={opt}
                            onChange={(e) => handleMcqOptionChange(qIdx, oIdx, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: Theory Questions */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-6">
            <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-brand-500" />
              Theory Questions
            </h2>
            <Button variant="outline" size="sm" onClick={handleAddTheory}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Question
            </Button>
          </div>

          {theoryQuestions.length === 0 ? (
            <Card glass={true} className="text-center py-10 text-slate-500">
              No theory questions added. Students will skip writing answers for this lecture.
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {theoryQuestions.map((q, idx) => (
                <Card key={idx} glass={true} className="border-slate-800 relative flex flex-col gap-4">
                  <button
                    onClick={() => handleRemoveTheory(idx)}
                    className="absolute top-6 right-6 text-slate-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>

                  <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">
                    Theory Question {idx + 1}
                  </h3>

                  <Input
                    label="Question Text *"
                    placeholder="e.g. Describe the Lifecycle of a Spring Bean."
                    value={q.question}
                    onChange={(e) => handleTheoryQuestionChange(idx, e.target.value)}
                  />

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-medium text-slate-300">Model Answer *</label>
                    <textarea
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-brand-500"
                      rows={3}
                      placeholder="Write the expected correct details..."
                      value={q.answer}
                      onChange={(e) => handleTheoryAnswerChange(idx, e.target.value)}
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex justify-end gap-3 mt-6 border-t border-slate-800 pt-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveQuiz} isLoading={saving}>
            Save Configured Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};
export default QuizManagement;
