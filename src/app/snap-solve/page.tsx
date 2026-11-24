'use client';
import { LearningToolsProvider, SnapSolve } from '@/components/learning-tools';
import { useLearningTools } from '@/components/learning-tools';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthPopup } from '@/hooks/useAuthPopup';
import { Button } from '@/components/ui/Button';

function OpenSnapSolve() {
  const { openTool } = useLearningTools();
  const { isAuthenticated } = useAuth();
  const { openPopup } = useAuthPopup();
  return (
    <Button
      onClick={() => {
        if (!isAuthenticated) {
          openPopup('login');
          return;
        }
        openTool('snapSolve');
      }}
    >
      Open Snap & Solve
    </Button>
  );
}

export default function SnapSolvePage() {
  return (
    <LearningToolsProvider questionRef="snap-solve-page" initialText="">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Snap & Solve</h1>
            <p className="mt-2 max-w-2xl text-base text-muted-foreground">
              Upload a photo of a question and get a step-by-step solution.
            </p>
          </div>
          <OpenSnapSolve />
        </div>
        <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
          <SnapSolve />
        </div>
      </div>
    </LearningToolsProvider>
  );
}
