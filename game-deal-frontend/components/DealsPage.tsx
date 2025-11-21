// components/DealsPage.tsx
'use client';

import { useState } from 'react';
import { Deal } from '../lib/api';
import DealCard from './DealCard';

interface DealsPageProps {
  initialDeals: Deal[];
}

export default function DealsPage({ initialDeals }: DealsPageProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어 필터링
  const filteredDeals = initialDeals.filter(deal =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* 검색 바 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="max-w-md">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            게임 검색
          </label>
          <input
            type="text"
            id="search"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="게임 제목을 입력하세요..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* 딜 리스트 */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          🔥 현재 진행 중인 딜 ({filteredDeals.length})
        </h2>
        
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
            <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
}