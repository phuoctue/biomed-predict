import { useState, useEffect, useCallback } from "react";
import { fetchDrugs, Drug } from "@/services/drug.service";

// Thêm searchQuery vào tham số truyền vào
export const useDrugs = (page: number, searchQuery: string) => {
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      // Giả định hàm fetchDrugs của bạn chấp nhận thêm tham số search
      const res = await fetchDrugs({ page, size: 10, search: searchQuery });
      setDrugs(res.data);
      setTotal(res.totalElements);
      setTotalPages(Math.ceil(res.totalElements / 10));
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  }, [page, searchQuery]); // <-- Phụ thuộc vào cả searchQuery

  useEffect(() => {
    loadData();
  }, [loadData]);

  return { drugs, loading, total, refetch: loadData, totalPages };
};