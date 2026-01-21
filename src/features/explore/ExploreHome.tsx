import { useMemo, useState, useEffect, useRef } from "react";
import {
  useGetExploreCategoriesQuery,
  useGetExploreItemsQuery,
} from "@/redux/api-slices/apiSlice";
import ExploreItemViewer from "./ExploreItemViewer";

type ExploreCategory = {
  _id: string;
  title: string;
  order?: number;
};

type ExploreItem = {
  _id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileType: string;
};

const fileBadge = (fileType: string) => {
  const t = (fileType || "").toLowerCase();
  if (t === "pdf") return "PDF";
  if (t === "ppt" || t === "pptx") return "PPT";
  return "FILE";
};

export default function ExploreHome() {
  const { data: categories = [], isLoading, isError } =
    useGetExploreCategoriesQuery();

  const [activeItem, setActiveItem] = useState<ExploreItem | null>(null);

  const sorted = useMemo(() => {
    return [...categories].sort((a: ExploreCategory, b: ExploreCategory) => {
      const ao = Number(a.order || 0);
      const bo = Number(b.order || 0);
      if (ao !== bo) return ao - bo;
      return String(a.title).localeCompare(String(b.title));
    });
  }, [categories]);

  if (isLoading) {
    return (
      <div className="py-10 text-center text-secondary-6">Loading Explore…</div>
    );
  }

  if (isError) {
    return (
      <div className="py-10 text-center text-red-700">
        Failed to load Explore.
      </div>
    );
  }

  return (
    <div className="w-full space-y-8">
      {sorted.map((cat: ExploreCategory) => (
        <ExploreCategoryRow
          key={cat._id}
          category={cat}
          onOpenItem={setActiveItem}
        />
      ))}

      {activeItem && (
        <ExploreItemViewer item={activeItem} onClose={() => setActiveItem(null)} />
      )}
    </div>
  );
}

function ExploreCategoryRow({
  category,
  onOpenItem,
}: {
  category: ExploreCategory;
  onOpenItem: (item: ExploreItem) => void;
}) {
  const { data: items = [], isLoading } = useGetExploreItemsQuery({
    categoryId: category._id,
  });
  const [showAll, setShowAll] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasOverflow, setHasOverflow] = useState(false);
  const [itemsPerRow, setItemsPerRow] = useState(4);

  // Check for overflow and calculate items per row
  useEffect(() => {
    const checkOverflow = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const itemWidth = 180; // Approximate width of each item including gap
        const calculatedItemsPerRow = Math.floor(containerWidth / itemWidth) || 4;
        setItemsPerRow(calculatedItemsPerRow);
        
        const hasScroll = containerRef.current.scrollWidth > containerRef.current.clientWidth;
        setHasOverflow(hasScroll || items.length > calculatedItemsPerRow);
      }
    };
    
    checkOverflow();
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [items.length]);

  const visibleItems = showAll ? items : items.slice(0, itemsPerRow);

  return (
    <section className="px-4 md:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg md:text-xl font-nokia-bold text-secondary-8">
          {category.title}
        </h2>
        <div className="text-sm text-secondary-6">
          {isLoading ? "Loading…" : `${items.length}`}
        </div>
      </div>

      <div className="overflow-x-auto" ref={containerRef}>
        <div className="flex gap-4 min-w-max pb-2">
          {isLoading ? (
            <div className="text-secondary-6 px-2">Loading…</div>
          ) : items.length === 0 ? (
            <div className="text-secondary-6 px-2">No items yet.</div>
          ) : (
            (showAll ? items : visibleItems).map((item: ExploreItem) => (
              <button
                key={item._id}
                onClick={() => onOpenItem(item)}
                className="w-[160px] md:w-[180px] flex-shrink-0 text-left rounded-2xl border border-accent-2 bg-white shadow hover:shadow-lg transition overflow-hidden"
              >
                <div className="aspect-[3/4] bg-secondary-1 relative overflow-hidden">
                  {item.imageUrl ? (
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-secondary-6 text-sm">
                      {fileBadge(item.fileType)}
                    </div>
                  )}
                  <div className="absolute top-2 left-2 text-xs px-2 py-1 rounded-full bg-accent-6 text-white">
                    {fileBadge(item.fileType)}
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-sm font-nokia-bold text-secondary-8 line-clamp-2">
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-secondary-6 mt-1 line-clamp-2">
                      {item.description}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      </div>
      {!showAll && hasOverflow && items.length > visibleItems.length && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-2 text-sm text-accent-6 hover:text-accent-7 font-nokia-bold"
        >
          See More ({items.length - visibleItems.length} more)
        </button>
      )}
    </section>
  );
}

