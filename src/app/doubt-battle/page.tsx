'use client';
import { LearningToolsProvider, DoubtBattle, useLearningTools } from '@/components/learning-tools';
import { Button } from '@/components/ui/Button';

export default function DoubtBattlePage() {
  return (
    <LearningToolsProvider questionRef="doubt-battle-page" initialText="">
      <DoubtBattlePageContent />
    </LearningToolsProvider>
  );
}

function DoubtBattlePageContent() {
  const { openTool } = useLearningTools();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Doubt Battle</h1>
          <p className="mt-2 max-w-2xl text-base text-muted-foreground">
            Challenge a friend to a short quiz duel on a subject you both study.
          </p>
        </div>
        <Button onClick={() => openTool('doubtBattle')}>Start a battle</Button>
      </div>
      <div className="rounded-xl border border-border/60 bg-card p-6 shadow-sm">
        <DoubtBattle />
      </div>
    </div>
  );
}
