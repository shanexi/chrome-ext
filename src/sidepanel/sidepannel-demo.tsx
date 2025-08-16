import React, { useEffect, useState } from "react";

interface RowData {
  name?: string;
  type?: string;
  description?: string;
}
/**
 * @deprecated AI 生成的 demo code 已经不再需要 保留一段时间
 */
export const SidePanelDemo: React.FC = () => {
  const [rowData, setRowData] = useState<RowData | null>(null);

  useEffect(() => {
    const loadRowData = async () => {
      try {
        const result = await chrome.storage.local.get(["currentRowData"]);
        if (result.currentRowData) {
          setRowData(result.currentRowData);
        }
      } catch (error) {
        console.error("Failed to load row data:", error);
      }
    };

    loadRowData();

    const handleStorageChange = (changes: any) => {
      if (changes.currentRowData) {
        setRowData(changes.currentRowData.newValue);
      }
    };

    chrome.storage.local.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.local.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return (
    <div className="p-6 h-full bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">ShellAgent</h1>

      {rowData ? (
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">
            当前行数据
          </h2>

          {rowData.name && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">名称: </span>
              <span className="text-gray-600">{rowData.name}</span>
            </div>
          )}

          {rowData.type && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">类型: </span>
              <span className="text-gray-600">{rowData.type}</span>
            </div>
          )}

          {rowData.description && (
            <div className="mb-2">
              <span className="font-medium text-gray-700">描述: </span>
              <span className="text-gray-600">{rowData.description}</span>
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-600">点击页面上的 button 以显示行数据</p>
      )}
    </div>
  );
};
