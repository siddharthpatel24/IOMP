import React, { useMemo } from 'react';

interface WordCloudProps {
  comments: Array<{
    text: string;
    sentiment: string;
  }>;
}

const WordCloudComponent = ({ comments }: WordCloudProps) => {
  const wordData = useMemo(() => {
    if (comments.length === 0) return [];

    // Extract all words from comments
    const allText = comments.map(c => c.text).join(' ');
    const words = allText
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3); // Filter short words

    // Count word frequency
    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array and sort by frequency
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 20) // Top 20 words
      .map(([word, count]) => ({ word, count }));
  }, [comments]);

  const maxCount = Math.max(...wordData.map(w => w.count), 1);

  if (comments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-lg">No comments available</p>
          <p className="text-sm">Submit some comments to generate a word cloud</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-64 overflow-hidden relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
      <div className="flex flex-wrap items-center justify-center h-full gap-2">
        {wordData.map(({ word, count }) => {
          const size = Math.max(12, (count / maxCount) * 24 + 12);
          const colors = [
            'text-blue-600',
            'text-indigo-600',
            'text-purple-600',
            'text-green-600',
            'text-red-600',
            'text-yellow-600',
            'text-pink-600'
          ];
          const color = colors[Math.floor(Math.random() * colors.length)];
          
          return (
            <span
              key={word}
              className={`font-bold ${color} hover:scale-110 transition-transform duration-200 cursor-pointer`}
              style={{ fontSize: `${size}px` }}
              title={`${word} (${count} times)`}
            >
              {word}
            </span>
          );
        })}
      </div>
      
      {wordData.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <p>Processing words...</p>
        </div>
      )}
    </div>
  );
};

export default WordCloudComponent;