import React, { useState, useCallback } from 'react';
import { Calculator, Info, Bot, Send, Activity } from 'lucide-react';

function App() {
  const [height, setHeight] = useState<string>('');
  const [weight, setWeight] = useState<string>('');
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState<string>('');
  const [showChat, setShowChat] = useState(false);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState<Array<{ type: 'user' | 'assistant'; text: string }>>([]);

  const calculateBMI = useCallback(() => {
    if (!height || !weight) return;

    const heightInMeters = parseFloat(height) / 100;
    const weightInKg = parseFloat(weight);
    const bmiValue = weightInKg / (heightInMeters * heightInMeters);
    setBmi(parseFloat(bmiValue.toFixed(1)));

    // Determine BMI category
    if (bmiValue < 18.5) setCategory('Underweight');
    else if (bmiValue >= 18.5 && bmiValue < 25) setCategory('Normal weight');
    else if (bmiValue >= 25 && bmiValue < 30) setCategory('Overweight');
    else setCategory('Obese');
  }, [height, weight]);

  const handleReset = () => {
    setHeight('');
    setWeight('');
    setBmi(null);
    setCategory('');
    setShowChat(false);
    setChat([]);
  };

  const getAIResponse = (userMessage: string) => {
    let response = '';
    
    if (bmi === null) {
      response = "Please calculate your BMI first so I can provide more specific advice.";
    } else {
      if (userMessage.toLowerCase().includes('diet') || userMessage.toLowerCase().includes('eat')) {
        if (category === 'Underweight') {
          response = "For underweight individuals, focus on nutrient-dense foods like nuts, whole grains, lean proteins, and healthy fats. Consider eating more frequent meals and adding healthy snacks between meals.";
        } else if (category === 'Overweight' || category === 'Obese') {
          response = "Focus on a balanced diet rich in vegetables, lean proteins, and whole grains. Control portion sizes and consider tracking your daily calorie intake.";
        } else {
          response = "Maintain your healthy weight by continuing a balanced diet with plenty of vegetables, fruits, lean proteins, and whole grains.";
        }
      } else if (userMessage.toLowerCase().includes('exercise') || userMessage.toLowerCase().includes('workout')) {
        if (category === 'Underweight') {
          response = "Focus on strength training exercises to build muscle mass. Include exercises like push-ups, squats, and lightweight training.";
        } else if (category === 'Overweight' || category === 'Obese') {
          response = "Start with low-impact exercises like walking, swimming, or cycling. Gradually increase intensity as your fitness improves.";
        } else {
          response = "Continue with a mix of cardio and strength training exercises. Aim for at least 150 minutes of moderate activity per week.";
        }
      } else {
        response = `Based on your BMI of ${bmi} (${category}), I recommend consulting with a healthcare provider for personalized advice. Would you like specific tips about diet or exercise?`;
      }
    }
    return response;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const userMessage = { type: 'user' as const, text: message };
    const aiMessage = { type: 'assistant' as const, text: getAIResponse(message) };
    
    setChat(prev => [...prev, userMessage, aiMessage]);
    setMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        {/* BMI Calculator Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Calculator className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">BMI Calculator</h1>
          </div>

          <div className="space-y-6">
            <div className="group">
              <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                Height (cm)
              </label>
              <input
                type="number"
                id="height"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                placeholder="Enter your height"
              />
            </div>

            <div className="group">
              <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2 group-hover:text-indigo-600 transition-colors">
                Weight (kg)
              </label>
              <input
                type="number"
                id="weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                placeholder="Enter your weight"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={calculateBMI}
                className="flex-1 bg-indigo-600 text-white px-6 py-3 rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <Activity className="w-5 h-5" />
                Calculate
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105"
              >
                Reset
              </button>
            </div>

            {bmi !== null && (
              <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 transform transition-all duration-500 animate-fade-in">
                <div className="flex items-center gap-3 mb-4">
                  <Info className="w-5 h-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-gray-800">Your Results</h2>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-700 text-lg">
                    Your BMI is <span className="font-bold text-indigo-600 text-2xl">{bmi}</span>
                  </p>
                  <p className="text-gray-700 text-lg">
                    Category: <span className="font-bold text-indigo-600">{category}</span>
                  </p>
                  <button
                    onClick={() => setShowChat(true)}
                    className="mt-4 flex items-center gap-2 text-indigo-600 hover:text-indigo-700 transition-colors px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md"
                  >
                    <Bot className="w-4 h-4" />
                    Get AI Health Advice
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* AI Chat Section */}
        <div className={`bg-white rounded-2xl shadow-xl p-6 md:p-8 transform transition-all duration-500 ${showChat ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
          {showChat && (
            <>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-indigo-100 p-3 rounded-full">
                  <Bot className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800">AI Health Assistant</h3>
              </div>
              
              <div className="h-[400px] overflow-y-auto mb-4 space-y-4 pr-4 custom-scrollbar">
                {chat.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl ${
                      msg.type === 'user'
                        ? 'bg-indigo-50 ml-12 transform hover:scale-102 transition-transform'
                        : 'bg-gray-50 mr-12 transform hover:scale-102 transition-transform'
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              <div className="flex gap-3 mt-auto">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask about diet, exercise, or health advice..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* BMI Categories */}
        <div className="md:col-span-2 bg-white rounded-2xl shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-100 p-3 rounded-full">
              <Info className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">BMI Categories</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { range: 'Less than 18.5', category: 'Underweight', color: 'blue' },
              { range: '18.5 - 24.9', category: 'Normal weight', color: 'green' },
              { range: '25 - 29.9', category: 'Overweight', color: 'yellow' },
              { range: '30 or greater', category: 'Obese', color: 'red' }
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-xl bg-gray-50 hover:shadow-md transition-all duration-300">
                <h3 className="font-semibold text-gray-800 mb-2">{item.category}</h3>
                <p className="text-gray-600">{item.range}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;