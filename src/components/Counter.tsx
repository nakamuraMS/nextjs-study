'use client'; // ← これを書くとClient Componentになる

import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setCount(count - 1)}
        className="px-4 py-2 bg-gray-200 rounded"
      >
        -
      </button>
      <span className="text-xl font-bold">{count}</span>
      <button
        onClick={() => setCount(count + 1)}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        +
      </button>
    </div>
  );
}