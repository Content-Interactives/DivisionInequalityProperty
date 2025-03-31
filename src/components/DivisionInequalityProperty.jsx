import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { RefreshCw } from 'lucide-react';

const DivisionInequalityProperty = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSteps, setShowSteps] = useState(false);
  const [completedSteps, setCompletedSteps] = useState({
    step1: false,
    step2: false
  });
  const [userAnswers, setUserAnswers] = useState({
    step1: '',
    step2: ''
  });
  const [hasError, setHasError] = useState({
    step1: false,
    step2: false
  });
  const [currentProblem, setCurrentProblem] = useState({
    coefficient: 0,
    constant: 0,
    isNegative: false,
    answer: '',
    steps: [],
    intermediateSteps: {}
  });

  const generateProblem = () => {
    const isNegative = Math.random() < 0.7; // 70% chance of negative coefficient
    let coefficient = Math.floor(Math.random() * 18) + 2;
    if (isNegative) coefficient = -coefficient;
    
    const answer = Math.floor(Math.random() * 10) - 5;
    const constant = coefficient * answer;
    const inequalitySign = Math.random() < 0.5 ? '>' : '<';
    
    const intermediateSteps = {
      step1: `${coefficient}x ÷ (${coefficient}) ${inequalitySign} ${constant} ÷ (${coefficient})`,
      step2: `x ${coefficient < 0 ? (inequalitySign === '>' ? '<' : '>') : inequalitySign} ${answer}`
    };

    setCurrentProblem({
      coefficient,
      constant,
      inequalitySign,
      isNegative: coefficient < 0,
      answer: answer.toString(),
      intermediateSteps
    });
    
    setCurrentStep(1);
    setCompletedSteps({
      step1: false,
      step2: false
    });
    setUserAnswers({
      step1: '',
      step2: ''
    });
    setHasError({
      step1: false,
      step2: false
    });
    setShowSteps(false);
  };

  const checkAnswer = (step, answer) => {
    let correct = false;
    switch (step) {
      case 1:
        // Normalize both answers by:
        // 1. Converting to lowercase
        // 2. Removing all whitespace
        // 3. Converting division symbols (÷, /) to a standard form
        // 4. Removing optional parentheses
        const normalizeAnswer = (str) => {
          return str
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[\/÷]/g, '÷')
            .replace(/\(([^)]+)\)/g, '$1');
        };
        
        const step1Answer = normalizeAnswer(answer);
        const expectedStep1 = normalizeAnswer(currentProblem.intermediateSteps.step1);
        correct = step1Answer === expectedStep1;
        if (correct) {
          setCompletedSteps(prev => ({ ...prev, step1: true }));
          setCurrentStep(2);
        }
        break;
      case 2:
        const userSolution = answer.replace(/\s/g, '').toLowerCase();
        const expectedSolution = currentProblem.intermediateSteps.step2.replace(/\s/g, '').toLowerCase();
        correct = userSolution === expectedSolution;
        if (correct) {
          setCompletedSteps(prev => ({ ...prev, step2: true }));
        }
        break;
    }
    setHasError(prev => ({ ...prev, [`step${step}`]: !correct }));
    return correct;
  };

  const skipStep = (step) => {
    setCompletedSteps(prev => ({ ...prev, [`step${step}`]: true }));
    setCurrentStep(step + 1);
  };

  useEffect(() => {
    generateProblem();
  }, []);

  return (
    <div className="bg-gray-100 p-8 w-full max-w-4xl mx-auto">
      <Card className="w-full shadow-md bg-white">
        <div className="bg-sky-50 p-6 rounded-t-lg">
          <h1 className="text-sky-900 text-2xl font-bold">Division Property of Inequality</h1>
          <p className="text-sky-800">Learn how to divide inequalities!</p>
        </div>

        <CardContent className="space-y-6 pt-6">
          <div className="bg-blue-50 p-4 rounded border border-blue-200">
            <h2 className="text-blue-900 font-bold mb-2">What is the Division Property of Inequality?</h2>
            <p className="text-blue-600">
              The Division Property of Inequality states that when dividing both sides of an inequality by a negative number, 
              the inequality's direction must be flipped in order to keep the inequality true. Practice using the Division 
              Property of Inequality while simplifying inequalities below!
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Example</h2>
            <Card className="border border-gray-200">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <p className="text-lg mt-8 mb-6">Given: -4x {'>'} 12</p>
                  <div>
                    <p className="font-medium">Step 1: Write out the division on both sides</p>
                    <div className="p-4 my-2">
                      -4x ÷ (-4) {'>'} 12 ÷ (-4)
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">Step 2: Simplify using division, and if the division involved a negative, flip the inequality sign</p>
                    <div className="p-4 my-2">
                      x {'>'} -3<br/>
                      x {'<'} -3
                    </div>
                  </div>
                  <p className="font-bold text-green-600 mt-4">
                    x {'<'} -3 is the simplified inequality
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-purple-900 font-bold">Practice Time!</h2>
              <Button 
                onClick={generateProblem}
                className="bg-sky-500 hover:bg-sky-600 text-white px-4 flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                New Problem
              </Button>
            </div>

            <div className="text-center text-2xl mb-4">
              <span className="font-mono">
                {currentProblem.coefficient}x {currentProblem.inequalitySign} {currentProblem.constant}
              </span>
            </div>

            <Button 
              onClick={() => setShowSteps(true)}
              className="w-full bg-blue-950 hover:bg-blue-900 text-white py-3"
            >
              Solve Step by Step
            </Button>

            {showSteps && (
              <div className="bg-purple-50 p-4 rounded-lg mt-4">
                <p className="mb-4">1. Write out the division on both sides:</p>
                {completedSteps.step1 ? (
                  <p className="text-green-600 font-bold mb-6">
                    {currentProblem.intermediateSteps.step1}
                  </p>
                ) : (
                  <div className="flex items-center gap-4 mb-6">
                    <Input 
                      type="text"
                      value={userAnswers.step1}
                      onChange={(e) => {
                        setUserAnswers(prev => ({ ...prev, step1: e.target.value }));
                        setHasError(prev => ({ ...prev, step1: false }));
                      }}
                      placeholder="e.g., 2x ÷ 2 > 6 ÷ 2"
                      className={`flex-1 ${hasError.step1 ? 'border-red-500' : 'border-blue-300'}`}
                    />
                    <div className="flex gap-4">
                      <Button
                        onClick={() => checkAnswer(1, userAnswers.step1)}
                        className="bg-blue-400 hover:bg-blue-500"
                      >
                        Check
                      </Button>
                      <Button
                        onClick={() => skipStep(1)}
                        className="bg-gray-400 hover:bg-gray-500 text-white"
                      >
                        Skip
                      </Button>
                    </div>
                  </div>
                )}

                {currentStep >= 2 && (
                  <>
                    <p className="mb-4">2. Simplify using division, and if the division involved a negative, flip the inequality sign:</p>
                    {completedSteps.step2 ? (
                      <>
                        <p className="text-green-600 font-bold mb-6">
                          {currentProblem.intermediateSteps.step2}
                        </p>
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                          <h3 className="text-green-800 text-xl font-bold">Great Work!</h3>
                          <p className="text-green-700">
                            {currentProblem.isNegative 
                              ? "You've successfully solved this inequality using the division property!"
                              : "You've successfully solved this inequality!"}
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center gap-4 mb-6">
                        <Input 
                          type="text"
                          value={userAnswers.step2}
                          onChange={(e) => {
                            setUserAnswers(prev => ({ ...prev, step2: e.target.value }));
                            setHasError(prev => ({ ...prev, step2: false }));
                          }}
                          placeholder="e.g., x > 3"
                          className={`flex-1 ${hasError.step2 ? 'border-red-500' : 'border-blue-300'}`}
                        />
                        <div className="flex gap-4">
                          <Button
                            onClick={() => checkAnswer(2, userAnswers.step2)}
                            className="bg-blue-400 hover:bg-blue-500"
                          >
                            Check
                          </Button>
                          <Button
                            onClick={() => skipStep(2)}
                            className="bg-gray-400 hover:bg-gray-500 text-white"
                          >
                            Skip
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <p className="text-center text-gray-600 mt-4">
        Understanding the division property of inequality is essential for solving more complex algebraic problems!
      </p>
    </div>
  );
};

export default DivisionInequalityProperty;