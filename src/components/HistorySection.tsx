interface HistorySectionProps {
    groupedHistory: Record<string, string[]>;
  }
  
  export default function HistorySection({ groupedHistory }: HistorySectionProps) {
    return (
      <div className="text-base flex flex-col gap-6">
        {Object.keys(groupedHistory).length > 0 ? (
          Object.entries(groupedHistory).map(([area, contents]) => (
            <div key={area}>
              <p className="text-lg font-semibold mb-2">{area}</p>
              <ul className="pl-5 list-disc flex flex-col gap-1">
                {contents.map((content, idx) => (
                  <li key={idx} className="text-gray-800">{content}</li>
                ))}
              </ul>
            </div>
          ))
        ) : (
          <p className="text-gray-500">히스토리 정보가 없습니다.</p>
        )}
      </div>
    );
  }
  