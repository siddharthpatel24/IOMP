// // Real AI Integration with Hugging Face and OpenAI
// // Falls back to mock functions if API calls fail

// const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
// const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// // Hugging Face Sentiment Analysis
// const analyzeWithHuggingFace = async (text: string) => {
//   if (!HF_API_KEY) {
//     throw new Error('Hugging Face API key not configured');
//   }

//   const response = await fetch(
//     'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
//     {
//       headers: {
//         'Authorization': `Bearer ${HF_API_KEY}`,
//         'Content-Type': 'application/json',
//       },
//       method: 'POST',
//       body: JSON.stringify({ inputs: text }),
//     }
//   );

//   if (!response.ok) {
//     throw new Error(`Hugging Face API error: ${response.status}`);
//   }

//   const result = await response.json();
  
//   // Handle the response format from Hugging Face
//   if (Array.isArray(result) && result.length > 0) {
//     const predictions = result[0];
//     const positive = predictions.find((p: any) => p.label === 'POSITIVE');
//     const negative = predictions.find((p: any) => p.label === 'NEGATIVE');
    
//     if (positive && negative) {
//       const sentiment = positive.score > negative.score ? 'Positive' : 'Negative';
//       const confidence = Math.round(Math.max(positive.score, negative.score) * 100);
//       return { sentiment, confidence };
//     }
//   }
  
//   throw new Error('Unexpected response format from Hugging Face');
// };

// // OpenAI Summarization
// const summarizeWithOpenAI = async (feedbackTexts: string[]) => {
//   if (!OPENAI_API_KEY) {
//     throw new Error('OpenAI API key not configured');
//   }

//   const combinedText = feedbackTexts.join('\n\n');
//   const prompt = `Please analyze and summarize the following citizen feedback on a government policy. Provide insights about the overall sentiment, main concerns, and key themes:

// ${combinedText}

// Summary:`;

//   const response = await fetch('https://api.openai.com/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Authorization': `Bearer ${OPENAI_API_KEY}`,
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify({
//       model: 'gpt-3.5-turbo',
//       messages: [
//         {
//           role: 'system',
//           content: 'You are an AI assistant that analyzes citizen feedback on government policies. Provide concise, balanced summaries highlighting key themes and sentiment.'
//         },
//         {
//           role: 'user',
//           content: prompt
//         }
//       ],
//       max_tokens: 300,
//       temperature: 0.7,
//     }),
//   });

//   if (!response.ok) {
//     throw new Error(`OpenAI API error: ${response.status}`);
//   }

//   const result = await response.json();
//   return result.choices[0]?.message?.content || 'Unable to generate summary';
// };

// // Mock AI functions (fallback)
// const mockSentimentAnalysis = async (text: string) => {
//   // Simulate API delay
//   await new Promise(resolve => setTimeout(resolve, 800));
  
//   const positiveKeywords = ['good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'appreciate', 'support', 'helpful', 'beneficial', 'positive', 'approve'];
//   const negativeKeywords = ['bad', 'terrible', 'awful', 'hate', 'dislike', 'disappointed', 'frustrated', 'angry', 'poor', 'worst', 'against', 'oppose', 'concern', 'problem'];
  
//   const lowerText = text.toLowerCase();
  
//   const positiveScore = positiveKeywords.reduce((score, word) => {
//     return score + (lowerText.split(word).length - 1);
//   }, 0);
  
//   const negativeScore = negativeKeywords.reduce((score, word) => {
//     return score + (lowerText.split(word).length - 1);
//   }, 0);
  
//   let sentiment;
//   if (positiveScore > negativeScore) {
//     sentiment = 'Positive';
//   } else if (negativeScore > positiveScore) {
//     sentiment = 'Negative';
//   } else {
//     sentiment = 'Neutral';
//   }
  
//   const confidence = Math.floor(Math.random() * 25) + 75; // 75-99%
  
//   return { sentiment, confidence };
// };

// // const mockSummarization = async (feedbackTexts: string[]) => {
// //   // Simulate API delay
// //   await new Promise(resolve => setTimeout(resolve, 1200));
  
// //   if (feedbackTexts.length === 0) {
// //     return "No feedback available to summarize.";
// //   }

// //   // Analyze actual feedback content
// //   const allText = feedbackTexts.join(' ').toLowerCase();
// //   const totalFeedback = feedbackTexts.length;
  
// //   // Extract key themes from actual feedback
// //   const themes = {
// //     implementation: ['implement', 'execution', 'deploy', 'rollout', 'launch', 'start'],
// //     budget: ['cost', 'money', 'budget', 'fund', 'expensive', 'cheap', 'price', 'financial'],
// //     timeline: ['time', 'deadline', 'schedule', 'delay', 'fast', 'slow', 'urgent', 'soon'],
// //     benefits: ['benefit', 'advantage', 'help', 'improve', 'better', 'positive', 'good'],
// //     concerns: ['concern', 'worry', 'problem', 'issue', 'challenge', 'difficulty', 'risk'],
// //     community: ['community', 'people', 'citizen', 'public', 'society', 'local', 'rural', 'urban'],
// //     technology: ['digital', 'online', 'tech', 'internet', 'app', 'system', 'platform'],
// //     environment: ['environment', 'green', 'clean', 'pollution', 'sustainable', 'eco'],
// //     education: ['education', 'school', 'student', 'learn', 'teach', 'knowledge', 'skill'],
// //     healthcare: ['health', 'medical', 'hospital', 'doctor', 'treatment', 'medicine', 'care']
// //   };

// //   // Count theme mentions
// //   const themeScores = {};
// //   Object.entries(themes).forEach(([theme, keywords]) => {
// //     themeScores[theme] = keywords.reduce((score, keyword) => {
// //       return score + (allText.split(keyword).length - 1);
// //     }, 0);
// //   });

// //   // Get top themes
// //   const topThemes = Object.entries(themeScores)
// //     .filter(([_, score]) => score > 0)
// //     .sort(([,a], [,b]) => b - a)
// //     .slice(0, 3)
// //     .map(([theme, _]) => theme);

// //   // Analyze sentiment distribution
// //   const sentimentAnalysis = await Promise.all(
// //     feedbackTexts.map(text => mockSentimentAnalysis(text))
// //   );
  
// //   const positive = sentimentAnalysis.filter(s => s.sentiment === 'Positive').length;
// //   const negative = sentimentAnalysis.filter(s => s.sentiment === 'Negative').length;
// //   const neutral = sentimentAnalysis.filter(s => s.sentiment === 'Neutral').length;
  
// //   const majoritysentiment = positive > negative && positive > neutral ? 'positive' : 
// //                            negative > positive && negative > neutral ? 'negative' : 'mixed';

// //   // Extract common phrases and keywords
// //   const words = allText.replace(/[^\w\s]/g, '').split(/\s+/)
// //     .filter(word => word.length > 4)
// //     .filter(word => !['this', 'that', 'with', 'from', 'they', 'have', 'will', 'been', 'were', 'said', 'each', 'which', 'their', 'would', 'there', 'could', 'other'].includes(word));
  
// //   const wordCount = words.reduce((acc, word) => {
// //     acc[word] = (acc[word] || 0) + 1;
// //     return acc;
// //   }, {});
  
// //   const topWords = Object.entries(wordCount)
// //     .sort(([,a], [,b]) => b - a)
// //     .slice(0, 5)
// //     .map(([word, _]) => word);

// //   // Generate dynamic summary based on actual content
// //   let summary = `Analysis of ${totalFeedback} citizen responses reveals `;
  
// //   // Add sentiment overview
// //   if (majoritysentiment === 'positive') {
// //     summary += `predominantly positive reception (${positive} positive, ${negative} negative, ${neutral} neutral responses). `;
// //   } else if (majoritysentiment === 'negative') {
// //     summary += `significant concerns (${negative} negative, ${positive} positive, ${neutral} neutral responses). `;
// //   } else {
// //     summary += `diverse perspectives (${positive} positive, ${negative} negative, ${neutral} neutral responses). `;
// //   }

// //   // Add key themes
// //   if (topThemes.length > 0) {
// //     summary += `Key discussion themes include ${topThemes.join(', ')}. `;
// //   }

// //   // Add specific insights based on top words
// //   if (topWords.length > 0) {
// //     summary += `Citizens frequently mentioned: ${topWords.slice(0, 3).join(', ')}. `;
// //   }

// //   // Add contextual insights based on themes
// //   if (topThemes.includes('implementation')) {
// //     summary += `Many responses focus on practical implementation challenges and execution strategies. `;
// //   }
// //   if (topThemes.includes('budget')) {
// //     summary += `Financial considerations and budget allocation are major points of discussion. `;
// //   }
// //   if (topThemes.includes('community')) {
// //     summary += `Community impact and local effects are prominent concerns among citizens. `;
// //   }
// //   if (topThemes.includes('benefits')) {
// //     summary += `Citizens recognize potential benefits while also raising practical questions. `;
// //   }
// //   if (topThemes.includes('concerns')) {
// //     summary += `Several concerns have been raised that may require policy refinement. `;
// //   }

// //   // Add conclusion
// //   if (majoritysentiment === 'positive') {
// //     summary += `Overall, the feedback indicates strong public support with constructive suggestions for improvement.`;
// //   } else if (majoritysentiment === 'negative') {
// //     summary += `The feedback suggests significant reservations that may need to be addressed before implementation.`;
// //   } else {
// //     summary += `The mixed feedback provides valuable insights for policy refinement and stakeholder engagement.`;
// //   }
  
// //   return summary;
// // };

// // Main exported functions with fallback logic
// export const analyzeSentiment = async (text: string) => {
//   try {
//     console.log('Attempting Hugging Face sentiment analysis...');
//     return await analyzeWithHuggingFace(text);
//   } catch (error) {
//     console.warn('Hugging Face API failed, using mock analysis:', error);
//     return await mockSentimentAnalysis(text);
//   }
// };

// export const summarizeFeedback = async (feedbackTexts: string[]) => {
//   try {
//     console.log('Attempting OpenAI summarization...');
//     return await summarizeWithOpenAI(feedbackTexts);
//   } catch (error) {
//     console.warn('OpenAI API failed, using mock summarization:', error);
//     return await mockSummarization(feedbackTexts);
//   }
// };

// // Legacy functions for backward compatibility
// export const generateSummary = async (text: string) => {
//   return await summarizeFeedback([text]);
// };

// export const generateCollectiveSummary = async (allCommentsText: string, totalComments: number) => {
//   const feedbackArray = allCommentsText.split('\n\n').filter(text => text.trim().length > 0);
//   return await summarizeFeedback(feedbackArray);
// };

// export const analyzeCollectiveSentiment = (comments: any[]) => {
//   const distribution = { positive: 0, negative: 0, neutral: 0 };
  
//   comments.forEach(comment => {
//     const sentiment = comment.sentiment.toLowerCase();
//     if (sentiment === 'positive') distribution.positive++;
//     else if (sentiment === 'negative') distribution.negative++;
//     else distribution.neutral++;
//   });
  
//   return distribution;
// };
// Real AI Integration with Hugging Face and OpenAI

// Real AI Integration with Hugging Face and OpenAI

// Real AI Integration with Hugging Face and OpenAI

const HF_API_KEY = import.meta.env.VITE_HF_API_KEY;
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

// Hugging Face Sentiment Analysis
const analyzeWithHuggingFace = async (text: string) => {
  if (!HF_API_KEY) {
    console.warn('Hugging Face API key not configured, using mock analysis');
    // Enhanced mock sentiment analysis based on keywords
    const positiveWords = ['good', 'great', 'excellent', 'support', 'agree', 'positive', 'beneficial', 'helpful', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'approve', 'favor', 'appreciate'];
    const negativeWords = ['bad', 'terrible', 'disagree', 'oppose', 'negative', 'harmful', 'wrong', 'against', 'hate', 'dislike', 'awful', 'horrible', 'reject', 'disapprove', 'concern', 'worried', 'problem', 'issue', 'fail'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    let sentiment = 'neutral';
    let confidence = 65;
    
    if (positiveCount > negativeCount && positiveCount > 0) {
      sentiment = 'positive';
      confidence = Math.min(85, 60 + positiveCount * 5);
    } else if (negativeCount > positiveCount && negativeCount > 0) {
      sentiment = 'negative';
      confidence = Math.min(85, 60 + negativeCount * 5);
    }
    
    return { sentiment, confidence };
  }

  try {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english',
      {
        headers: {
          'Authorization': `Bearer ${HF_API_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ inputs: text }),
      }
    );

    if (!response.ok) {
      throw new Error(`Hugging Face API error: ${response.status}`);
    }

    const result = await response.json();
    
    // Handle the response format from Hugging Face
    if (Array.isArray(result) && result.length > 0) {
      const predictions = result[0];
      const positive = predictions.find((p: any) => p.label === 'POSITIVE');
      const negative = predictions.find((p: any) => p.label === 'NEGATIVE');
      
      if (positive && negative) {
        const sentiment = positive.score > negative.score ? 'positive' : 'negative';
        const confidence = Math.round(Math.max(positive.score, negative.score) * 100);
        return { sentiment, confidence };
      }
    }
    
    throw new Error('Unexpected response format from Hugging Face');
  } catch (error) {
    console.error('Hugging Face API failed, using mock analysis:', error);
    // Fallback to mock analysis
    const positiveWords = ['good', 'great', 'excellent', 'support', 'agree', 'positive', 'beneficial', 'helpful', 'amazing', 'wonderful', 'fantastic', 'love', 'like', 'approve', 'favor', 'appreciate'];
    const negativeWords = ['bad', 'terrible', 'disagree', 'oppose', 'negative', 'harmful', 'wrong', 'against', 'hate', 'dislike', 'awful', 'horrible', 'reject', 'disapprove', 'concern', 'worried', 'problem', 'issue', 'fail'];
    
    const lowerText = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;
    
    let sentiment = 'neutral';
    let confidence = 65;
    
    if (positiveCount > negativeCount && positiveCount > 0) {
      sentiment = 'positive';
      confidence = Math.min(85, 60 + positiveCount * 5);
    } else if (negativeCount > positiveCount && negativeCount > 0) {
      sentiment = 'negative';
      confidence = Math.min(85, 60 + negativeCount * 5);
    }
    
    return { sentiment, confidence };
  }
};

// OpenAI Summarization
const summarizeWithOpenAI = async (feedbackTexts: string[]) => {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not configured, using intelligent mock summary');
    return generateIntelligentMockSummary(feedbackTexts);
  }

  try {
    const combinedText = feedbackTexts.join('\n\n');
    const prompt = `Please analyze and summarize the following citizen feedback on a government policy. Provide insights about the overall sentiment, main concerns, and key themes:

${combinedText}

Summary:`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an AI assistant that analyzes citizen feedback on government policies. Provide concise, balanced summaries highlighting key themes and sentiment.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const result = await response.json();
    return result.choices[0]?.message?.content || 'Unable to generate summary';
  } catch (error) {
    console.error('OpenAI API failed, using intelligent mock summary:', error);
    return generateIntelligentMockSummary(feedbackTexts);
  }
};

// Intelligent mock summary generator
const generateIntelligentMockSummary = (feedbackTexts: string[]) => {
  if (feedbackTexts.length === 0) {
    return 'No feedback available to summarize.';
  }

  const combinedText = feedbackTexts.join(' ').toLowerCase();
  
  // Extract key themes
  const themes = {
    implementation: ['implement', 'execution', 'deploy', 'rollout', 'launch'],
    budget: ['cost', 'budget', 'money', 'funding', 'expensive', 'affordable'],
    community: ['community', 'people', 'citizens', 'public', 'society'],
    infrastructure: ['infrastructure', 'facilities', 'resources', 'equipment'],
    timeline: ['time', 'schedule', 'deadline', 'duration', 'quick', 'slow'],
    benefits: ['benefit', 'advantage', 'help', 'improve', 'better'],
    concerns: ['concern', 'worry', 'problem', 'issue', 'challenge']
  };

  const detectedThemes = [];
  for (const [theme, keywords] of Object.entries(themes)) {
    if (keywords.some(keyword => combinedText.includes(keyword))) {
      detectedThemes.push(theme);
    }
  }

  // Analyze sentiment distribution
  const positiveWords = ['good', 'great', 'excellent', 'support', 'agree', 'positive', 'beneficial', 'helpful'];
  const negativeWords = ['bad', 'terrible', 'disagree', 'oppose', 'negative', 'harmful', 'wrong', 'against'];
  
  const positiveCount = positiveWords.filter(word => combinedText.includes(word)).length;
  const negativeCount = negativeWords.filter(word => combinedText.includes(word)).length;
  
  let overallSentiment = 'mixed';
  if (positiveCount > negativeCount * 1.5) overallSentiment = 'generally positive';
  else if (negativeCount > positiveCount * 1.5) overallSentiment = 'generally negative';

  // Generate dynamic summary
  const totalFeedback = feedbackTexts.length;
  const averageLength = Math.round(feedbackTexts.reduce((sum, text) => sum + text.length, 0) / totalFeedback);
  
  let summary = `Analysis of ${totalFeedback} citizen responses reveals ${overallSentiment} feedback on this policy initiative. `;
  
  if (detectedThemes.length > 0) {
    summary += `Key discussion themes include ${detectedThemes.slice(0, 3).join(', ')}. `;
  }
  
  summary += `Citizens have provided substantive feedback with an average response length of ${averageLength} characters, indicating thoughtful engagement. `;
  
  if (overallSentiment === 'generally positive') {
    summary += 'The feedback shows strong public support with constructive suggestions for improvement.';
  } else if (overallSentiment === 'generally negative') {
    summary += 'The responses highlight significant concerns that warrant careful consideration during implementation.';
  } else {
    summary += 'The diverse perspectives provide valuable insights for policy refinement and balanced implementation.';
  }

  return summary;
};

// Main exported functions
export const analyzeSentiment = async (text: string) => {
  return await analyzeWithHuggingFace(text);
};

export const summarizeFeedback = async (feedbackTexts: string[]) => {
  return await summarizeWithOpenAI(feedbackTexts);
};

// Legacy functions for backward compatibility
export const generateSummary = async (text: string) => {
  return await summarizeFeedback([text]);
};

export const generateCollectiveSummary = async (allCommentsText: string, totalComments: number) => {
  const feedbackArray = allCommentsText.split('\n\n').filter(text => text.trim().length > 0);
  return await summarizeFeedback(feedbackArray);
};

export const analyzeCollectiveSentiment = (comments: any[]) => {
  const distribution = { positive: 0, negative: 0, neutral: 0 };
  
  comments.forEach(comment => {
    const sentiment = comment.sentiment.toLowerCase();
    if (sentiment === 'positive') distribution.positive++;
    else if (sentiment === 'negative') distribution.negative++;
    else distribution.neutral++;
  });
  
  return distribution;
};