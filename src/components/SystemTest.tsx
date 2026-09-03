import React from 'react';
import { ArrowLeft, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { runSystemTest, getTestSummary } from '../utils/systemTest';
import { Project } from '../types';
import { useProjectStore } from '../store/projectStore';

interface SystemTestProps {
  project: Project;
  onBack: () => void;
}

function SystemTest({ project, onBack }: SystemTestProps) {
  const { currentProjectData } = useProjectStore();
  
  const calculations = currentProjectData?.calculations || {};
  const loads = currentProjectData?.loads || [];
  const equipment = currentProjectData?.equipment || [];

  const issues = runSystemTest(calculations, loads, equipment);
  const summary = getTestSummary(issues);

  const getStatusIcon = (status: string) => {
    if (status === 'pass') return <CheckCircle className="text-green-500" size={20} />;
    if (status === 'warning') return <AlertTriangle className="text-yellow-500" size={20} />;
    return <AlertCircle className="text-red-500" size={20} />;
  };

  const getStatusColor = (status: string) => {
    if (status === 'pass') return 'bg-green-50 border-green-300';
    if (status === 'warning') return 'bg-yellow-50 border-yellow-300';
    return 'bg-red-50 border-red-300';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-blue-600 hover:text-blue-800 font-semibold"
        >
          <ArrowLeft size={20} />
          Back to Design
        </button>

        {/* Summary Card */}
        <div className={`rounded-lg shadow-2xl p-12 mb-8 text-center border-2 ${
          summary.status === 'pass'
            ? 'bg-green-50 border-green-300'
            : summary.status === 'warning'
            ? 'bg-yellow-50 border-yellow-300'
            : 'bg-red-50 border-red-300'
        }`}>
          <p className={`text-6xl font-bold mb-2 ${
            summary.status === 'pass'
              ? 'text-green-700'
              : summary.status === 'warning'
              ? 'text-yellow-700'
              : 'text-red-700'
          }`}>
            {summary.message}
          </p>
          <p className={`text-xl mb-4 ${
            summary.status === 'pass'
              ? 'text-green-600'
              : summary.status === 'warning'
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}>
            {summary.description}
          </p>
          <div className="flex justify-center gap-8 text-lg font-bold">
            <div className="text-green-600">✓ {summary.passCount} Passed</div>
            <div className="text-yellow-600">⚠ {summary.warningCount} Warnings</div>
            <div className="text-red-600">✕ {summary.failCount} Failed</div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold mb-6">Detailed Test Results</h2>
          {issues.map((issue, idx) => (
            <div
              key={idx}
              className={`rounded-lg border-l-4 p-6 ${getStatusColor(issue.status)}`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {getStatusIcon(issue.status)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-1">{issue.category}</h3>
                  <p className="font-semibold text-base mb-2">{issue.problem}</p>
                  <p className="text-gray-700 text-sm mb-2">{issue.explanation}</p>
                  {issue.recommendation && (
                    <p className="text-sm bg-white bg-opacity-50 p-3 rounded mt-2">
                      <span className="font-bold">Recommendation:</span> {issue.recommendation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onBack}
          className="mt-8 w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-3 rounded-lg transition-all"
        >
          Continue with Design
        </button>
      </div>
    </div>
  );
}

export default SystemTest;