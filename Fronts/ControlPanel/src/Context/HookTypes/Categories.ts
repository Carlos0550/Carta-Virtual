export interface CategoriesModal{
    opened: boolean,
    formType?: "edit" | "create",
    editCategoryData?: Category | null
}

export interface CategoriesForm{
    category_name: string,
    category_description: string
}

export interface Category{
    category_id: string,
    category_name: string,
    category_description: string,
    category_image: string,
    category_products_count: number
}