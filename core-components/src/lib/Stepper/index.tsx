import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { Tabs } from 'radix-ui';
import { Check } from 'lucide-react';
import clsx from 'clsx';

export interface Step {
  id: string;
  label: string;
  description?: string;
  render: () => React.ReactNode;
}

interface StepperProps {
  steps: Step[];
  onFinish?: () => void;
  showNumbers?: boolean;
}

export interface ICWStepper {
  goPrev: () => void;
  goNext: () => void;
}

export const CWStepper = forwardRef<ICWStepper, StepperProps>(
  ({ steps, onFinish, showNumbers = true }, ref) => {
    const ids = useMemo(() => steps.map((s) => s.id), [steps]);
    const [currentId, setCurrentId] = useState(ids[0]);
    const [furthestIndex, setFurthestIndex] = React.useState(0);

    const currentIndex = useMemo(() => {
      return ids.indexOf(currentId);
    }, [currentId, ids]);

    const isLast = useMemo(() => {
      return currentIndex === ids.length - 1;
    }, [currentIndex, ids]);

    React.useEffect(() => {
      if (currentIndex > furthestIndex) {
        setFurthestIndex(currentIndex);
      }
    }, [currentIndex, furthestIndex]);

    const goPrev = () => {
      const prev = Math.max(0, currentIndex - 1);
      setCurrentId(ids[prev]);
    };

    const goNext = () => {
      if (isLast) {
        onFinish?.();
        return;
      }
      const next = Math.min(ids.length - 1, currentIndex + 1);
      setCurrentId(ids[next]);
    };

    useImperativeHandle(ref, () => ({
      goPrev: goPrev,
      goNext: goNext,
    }));

    return (
      <Tabs.Root
        value={currentId}
        onValueChange={setCurrentId}
        className="w-full"
      >
        <Tabs.List className="flex gap-6">
          {steps.map((step, i) => {
            const completed = i < currentIndex;
            const active = i === currentIndex;

            return (
              <Tabs.Trigger
                key={step.id}
                value={step.id}
                disabled
                className="flex gap-2"
              >
                <span
                  className={clsx(
                    'border border-border size-6 rounded-full flex items-center justify-center text-xs',
                    active && 'bg-primary text-white',
                    completed && 'bg-success text-white'
                  )}
                >
                  {completed ? (
                    <Check className="size-4" aria-hidden={true} />
                  ) : showNumbers ? (
                    i + 1
                  ) : (
                    <span className="sr-only">{step.label}</span>
                  )}
                </span>
                <span className="flex flex-col text-left">
                  <span
                    className={clsx(
                      active ? 'text-primary' : 'text-text-main',
                      'truncate text-sm font-semibold '
                    )}
                  >
                    {step.label}
                  </span>
                  {step.description && (
                    <span className="truncate text-xs text-text-main">
                      {step.description}
                    </span>
                  )}
                </span>
              </Tabs.Trigger>
            );
          })}
        </Tabs.List>
        <div className="mt-6">
          {steps.map((step) => (
            <Tabs.Content key={step.id} value={step.id}>
              <div className="min-h-32">{step.render()}</div>
            </Tabs.Content>
          ))}
        </div>
      </Tabs.Root>
    );
  }
);
