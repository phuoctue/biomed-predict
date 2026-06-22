import { useCallback, useEffect, useState } from "react";
import {
  bookmarkDrug,
  DrugBookmark,
  fetchBookmarkedDrugs,
  removeDrugBookmark
} from "@/services/drug.service";

const getPageData = (response: any): DrugBookmark[] => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.content)) return response.data.content;
  if (Array.isArray(response?.content)) return response.content;
  return [];
};

const getTotalElements = (response: any, fallback: number) =>
  response?.totalElements ?? response?.data?.totalElements ?? fallback;

const getTotalPages = (response: any, total: number, size: number) =>
  response?.totalPages ?? response?.data?.totalPages ?? Math.max(1, Math.ceil(total / size));

export const useDrugBookmarks = (page = 0, keyword = "", size = 10) => {
  const [bookmarks, setBookmarks] = useState<DrugBookmark[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const loadBookmarks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetchBookmarkedDrugs({ page, size, keyword });
      const items = getPageData(response);
      const totalElements = getTotalElements(response, items.length);

      setBookmarks(items);
      setBookmarkedIds(new Set(items.map((drug) => drug.id)));
      setTotal(totalElements);
      setTotalPages(getTotalPages(response, totalElements, size));
    } catch (error) {
      console.error("Cannot load bookmarked drugs:", error);
      setBookmarks([]);
      setBookmarkedIds(new Set());
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [keyword, page, size]);

  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  const toggleBookmark = useCallback(
    async (drugId: number, nextBookmarked?: boolean) => {
      setSavingId(drugId);
      const shouldBookmark = nextBookmarked ?? !bookmarkedIds.has(drugId);

      try {
        if (shouldBookmark) {
          await bookmarkDrug(drugId);
          setBookmarkedIds((current) => new Set(current).add(drugId));
        } else {
          await removeDrugBookmark(drugId);
          setBookmarkedIds((current) => {
            const next = new Set(current);
            next.delete(drugId);
            return next;
          });
          setBookmarks((current) => current.filter((drug) => drug.id !== drugId));
        }
      } finally {
        setSavingId(null);
      }
    },
    [bookmarkedIds]
  );

  return {
    bookmarks,
    bookmarkedIds,
    loading,
    savingId,
    total,
    totalPages,
    refetch: loadBookmarks,
    toggleBookmark
  };
};
