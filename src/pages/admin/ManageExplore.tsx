import { useState } from "react";
import { useAdminGetExploreCategoriesQuery, useAdminCreateExploreCategoryMutation, useAdminUpdateExploreCategoryMutation, useAdminDeleteExploreCategoryMutation } from "@/redux/api-slices/apiSlice";
import { useAdminGetExploreItemsQuery, useAdminCreateExploreItemMutation, useAdminUpdateExploreItemMutation, useAdminDeleteExploreItemMutation } from "@/redux/api-slices/apiSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Trash, PencilSimple, Plus, X, FilePdf, FilePpt, FolderOpen } from "@phosphor-icons/react";
import LoadingSpinner from "@/components/LoadingSpinner";

const ManageExplore = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  const { data: categoriesData, isLoading: categoriesLoading, refetch: refetchCategories } = useAdminGetExploreCategoriesQuery();
  const { data: itemsData, isLoading: itemsLoading, refetch: refetchItems } = useAdminGetExploreItemsQuery(
    selectedCategory ? { categoryId: selectedCategory } : undefined,
    { skip: !selectedCategory }
  );
  
  const [createCategory] = useAdminCreateExploreCategoryMutation();
  const [updateCategory] = useAdminUpdateExploreCategoryMutation();
  const [deleteCategory] = useAdminDeleteExploreCategoryMutation();
  const [createItem] = useAdminCreateExploreItemMutation();
  const [updateItem] = useAdminUpdateExploreItemMutation();
  const [deleteItem] = useAdminDeleteExploreItemMutation();

  const categories = categoriesData || [];
  const items = itemsData || [];

  const [categoryForm, setCategoryForm] = useState({ title: "", description: "", order: 0 });
  const [itemForm, setItemForm] = useState({ title: "", description: "", file: null as File | null, image: null as File | null });
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isUpdatingCategory, setIsUpdatingCategory] = useState(false);
  const [isCreatingItem, setIsCreatingItem] = useState(false);
  const [isUpdatingItem, setIsUpdatingItem] = useState(false);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingCategory(true);
    try {
      await createCategory({ title: categoryForm.title, description: categoryForm.description, order: categoryForm.order }).unwrap();
      toast.success("Category created successfully");
      setCategoryForm({ title: "", description: "", order: 0 });
      setShowCategoryForm(false);
      refetchCategories();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to create category");
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setIsUpdatingCategory(true);
    try {
      await updateCategory({ id: editingCategory._id, title: categoryForm.title, description: categoryForm.description, order: categoryForm.order }).unwrap();
      toast.success("Category updated successfully");
      setEditingCategory(null);
      setCategoryForm({ title: "", description: "", order: 0 });
      setShowCategoryForm(false);
      refetchCategories();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update category");
    } finally {
      setIsUpdatingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category? All items in it will also be deleted.")) return;
    try {
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
      if (selectedCategory === id) setSelectedCategory(null);
      refetchCategories();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete category");
    }
  };

  const handleEditCategory = (category: any) => {
    setEditingCategory(category);
    setCategoryForm({ title: category.title, description: category.description || "", order: category.order || 0 });
    setShowCategoryForm(true);
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !itemForm.file) {
      toast.error("Please select a category and upload a file");
      return;
    }
    setIsCreatingItem(true);
    try {
      const formData = new FormData();
      formData.append("title", itemForm.title);
      formData.append("description", itemForm.description);
      formData.append("file", itemForm.file);
      if (itemForm.image) {
        formData.append("image", itemForm.image);
      }
      
      await createItem({ categoryId: selectedCategory, formData }).unwrap();
      toast.success("Item created successfully");
      setItemForm({ title: "", description: "", file: null, image: null });
      setShowItemForm(false);
      refetchItems();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to create item");
    } finally {
      setIsCreatingItem(false);
    }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    setIsUpdatingItem(true);
    try {
      const formData = new FormData();
      if (itemForm.image) {
        formData.append("image", itemForm.image);
      }
      
      await updateItem({ id: editingItem._id, title: itemForm.title, description: itemForm.description, formData: itemForm.image ? formData : undefined }).unwrap();
      toast.success("Item updated successfully");
      setEditingItem(null);
      setItemForm({ title: "", description: "", file: null, image: null });
      setShowItemForm(false);
      refetchItems();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to update item");
    } finally {
      setIsUpdatingItem(false);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await deleteItem(id).unwrap();
      toast.success("Item deleted successfully");
      refetchItems();
    } catch (error: any) {
      toast.error(error?.data?.error || "Failed to delete item");
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item);
    setItemForm({ title: item.title, description: item.description || "", file: null, image: null });
    setShowItemForm(true);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType === "application/pdf") return <FilePdf size={24} className="text-red-500" />;
    if (fileType.includes("presentation") || fileType.includes("powerpoint")) return <FilePpt size={24} className="text-orange-500" />;
    return <FilePdf size={24} />;
  };

  return (
    <>
      <ToastContainer />
      <div className="flex flex-col h-auto mt-12 pt-12 w-[100%] mx-auto space-y-6 px-4 font-nokia-bold">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-secondary-8">Manage Explore / Supplements</h2>
          <button
            onClick={() => {
              setShowCategoryForm(!showCategoryForm);
              setEditingCategory(null);
              setCategoryForm({ title: "", description: "", order: 0 });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-6 hover:bg-accent-7 text-white font-bold"
          >
            <Plus size={20} weight="bold" />
            {showCategoryForm ? "Hide Form" : "Create Category"}
          </button>
        </div>

        {showCategoryForm && (
          <div className="bg-primary-5 p-6 rounded-2xl border border-accent-6">
            <h3 className="text-xl font-bold text-secondary-8 mb-4">
              {editingCategory ? "Edit Category" : "Create New Category"}
            </h3>
            <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-secondary-7 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={categoryForm.title}
                  onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                  required
                  className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-secondary-6"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary-7 mb-1">Description</label>
                <textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  rows={3}
                  className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-secondary-6"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-secondary-7 mb-1">Order</label>
                <input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
                  className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-secondary-6"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={isCreatingCategory || isUpdatingCategory}
                  className="px-6 py-2 rounded-xl bg-accent-6 hover:bg-accent-7 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {(isCreatingCategory || isUpdatingCategory) && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  )}
                  {editingCategory ? (isUpdatingCategory ? "Updating..." : "Update") : (isCreatingCategory ? "Creating..." : "Create")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCategoryForm(false);
                    setEditingCategory(null);
                    setCategoryForm({ title: "", description: "", order: 0 });
                  }}
                  className="px-6 py-2 rounded-xl border-2 border-accent-6 text-accent-6 hover:bg-accent-6 hover:text-white font-bold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-bold text-secondary-8 mb-4">Categories</h3>
            {categoriesLoading ? (
              <LoadingSpinner text="Loading categories..." size="sm" />
            ) : categories.length === 0 ? (
              <div className="text-center py-8 border-2 border-dashed border-accent-6 rounded-xl">
                <p className="text-secondary-6">No categories yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category: any) => (
                  <div
                    key={category._id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedCategory === category._id
                        ? "border-accent-6 bg-accent-6/10"
                        : "border-accent-2 hover:border-accent-6 bg-primary-5"
                    }`}
                    onClick={() => setSelectedCategory(category._id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <FolderOpen size={24} className="text-accent-6 mt-1" />
                        <div className="flex-1">
                          <h4 className="font-bold text-secondary-8">{category.title}</h4>
                          {category.description && (
                            <p className="text-sm text-secondary-6 mt-1 line-clamp-2">{category.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1 ml-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditCategory(category);
                          }}
                          className="p-1 rounded hover:bg-accent-6/20 text-accent-6"
                        >
                          <PencilSimple size={18} weight="bold" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(category._id);
                          }}
                          className="p-1 rounded hover:bg-red-500/20 text-red-500"
                        >
                          <Trash size={18} weight="bold" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="lg:col-span-2">
            {selectedCategory ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-secondary-8">
                    Items in {categories.find((c: any) => c._id === selectedCategory)?.title || "Category"}
                  </h3>
                  <button
                    onClick={() => {
                      setShowItemForm(!showItemForm);
                      setEditingItem(null);
                      setItemForm({ title: "", description: "", file: null, image: null });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent-6 hover:bg-accent-7 text-white font-bold"
                  >
                    <Plus size={20} weight="bold" />
                    {showItemForm ? "Hide Form" : "Add Item"}
                  </button>
                </div>

                {showItemForm && (
                  <div className="bg-primary-5 p-6 rounded-2xl border border-accent-6 mb-6">
                    <h4 className="text-lg font-bold text-secondary-8 mb-4">
                      {editingItem ? "Edit Item" : "Create New Item"}
                    </h4>
                    <form onSubmit={editingItem ? handleUpdateItem : handleCreateItem} className="space-y-4">
                      <div>
                        <label className="block text-sm font-bold text-secondary-7 mb-1">Title *</label>
                        <input
                          type="text"
                          value={itemForm.title}
                          onChange={(e) => setItemForm({ ...itemForm, title: e.target.value })}
                          required
                          className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-secondary-6"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-secondary-7 mb-1">Description</label>
                        <textarea
                          value={itemForm.description}
                          onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                          rows={3}
                          className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-secondary-6"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-secondary-7 mb-1">
                          Image (Optional)
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setItemForm({ ...itemForm, image: e.target.files?.[0] || null })}
                          className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-secondary-6"
                        />
                        {editingItem && editingItem.imageUrl && (
                          <div className="mt-2">
                            <p className="text-xs text-secondary-6 mb-1">Current image:</p>
                            <img src={editingItem.imageUrl} alt="Current" className="w-32 h-32 object-cover rounded-lg border border-accent-2" />
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-secondary-7 mb-1">
                          File {!editingItem && "*"} (PDF or PPT)
                        </label>
                        <input
                          type="file"
                          accept=".pdf,.ppt,.pptx"
                          onChange={(e) => setItemForm({ ...itemForm, file: e.target.files?.[0] || null })}
                          required={!editingItem}
                          className="w-full border border-accent-2 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-accent-6 bg-white text-secondary-6"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isCreatingItem || isUpdatingItem}
                          className="px-6 py-2 rounded-xl bg-accent-6 hover:bg-accent-7 text-white font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {(isCreatingItem || isUpdatingItem) && (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          )}
                          {editingItem ? (isUpdatingItem ? "Updating..." : "Update") : (isCreatingItem ? "Creating..." : "Create")}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setShowItemForm(false);
                            setEditingItem(null);
                            setItemForm({ title: "", description: "", file: null, image: null });
                          }}
                          className="px-6 py-2 rounded-xl border-2 border-accent-6 text-accent-6 hover:bg-accent-6 hover:text-white font-bold"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {itemsLoading ? (
                  <LoadingSpinner text="Loading items..." size="sm" />
                ) : items.length === 0 ? (
                  <div className="text-center py-12 border-2 border-dashed border-accent-6 rounded-xl">
                    <p className="text-secondary-6 mb-4">No items in this category yet</p>
                    <button
                      onClick={() => setShowItemForm(true)}
                      className="px-6 py-2 rounded-full bg-accent-6 hover:bg-accent-7 text-white font-bold"
                    >
                      Add First Item
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {items.map((item: any) => (
                      <div
                        key={item._id}
                        className="border-2 border-accent-2 rounded-xl p-4 bg-primary-5 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start gap-3 mb-3">
                          {getFileIcon(item.fileType)}
                          <div className="flex-1">
                            <h4 className="font-bold text-secondary-8 mb-1">{item.title}</h4>
                            {item.description && (
                              <p className="text-sm text-secondary-6 line-clamp-2">{item.description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditItem(item)}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent-6 hover:bg-accent-7 text-white font-bold"
                          >
                            <PencilSimple size={18} weight="bold" />
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item._id)}
                            className="px-4 py-2 rounded-lg border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white font-bold transition-colors"
                          >
                            <Trash size={18} weight="bold" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 border-2 border-dashed border-accent-6 rounded-xl">
                <FolderOpen size={48} className="mx-auto text-accent-6 mb-4" />
                <p className="text-secondary-6 text-lg">Select a category to view and manage items</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageExplore;
